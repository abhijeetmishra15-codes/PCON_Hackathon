import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      resumeId, fileUrl, jobTitle, jobDescription, 
      action, referralData, roadmapData, interviewData
    } = await req.json();

    const noResumeNeeded = action === 'generate_referral' || action === 'evaluate_interview_answer';

    if (!noResumeNeeded && (!resumeId || !fileUrl)) {
      return new Response(JSON.stringify({ error: 'Missing resumeId or fileUrl' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let base64Pdf = null;

    if (!noResumeNeeded) {
      // Verify ownership of the resume
      const { data: resumeRecord, error: resumeError } = await supabaseClient
        .from('resumes')
        .select('student_id')
        .eq('id', resumeId)
        .single();

      if (resumeError || !resumeRecord || resumeRecord.student_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized access to resume' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 1. Download the file from Supabase Storage
      const { data: fileData, error: downloadError } = await supabaseClient.storage
        .from('resumes')
        .download(fileUrl);

      if (downloadError || !fileData) {
        return new Response(JSON.stringify({ error: 'Failed to download resume file' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Convert Blob to Base64
      const arrayBuffer = await fileData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      base64Pdf = btoa(binary);
    }

    // 2. Call Gemini API
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Gemini API Key is missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isJobMatch = !!jobDescription;

    let prompt = '';
    
    if (action === 'generate_referral') {
      prompt = `Generate a concise, professional referral request message for a student contacting an alumni.
Details:
Student: ${referralData?.studentName || 'A student'} (${referralData?.studentDepartment || 'Unknown Department'})
Student Skills: ${referralData?.studentSkills || 'Various skills'}
Target Opportunity: ${referralData?.targetOpportunity || 'a role'} at ${referralData?.company || 'your company'}
Alumni: ${referralData?.alumniName || 'Alumni'} (${referralData?.alumniRole || 'Employee'} at ${referralData?.alumniCompany || 'the company'})

Requirements:
- Greeting (Dear [Alumni Name])
- 2-3 sentence introduction
- Reason for requesting referral
- Thank you
- Professional closing

Return ONLY a valid JSON object matching exactly this structure, with no markdown, no code blocks, and no extra text:
{
  "message": ""
}

Limits:
- message: maximum 120 words`;
    } else if (action === 'generate_roadmap') {
      prompt = `Create a personalized career roadmap based on this resume and details:
Target Role: ${roadmapData?.targetRole || 'Unknown'}
Target Company: ${roadmapData?.targetCompany || 'Any'}
Department: ${roadmapData?.department || 'Unknown'}
Skills: ${roadmapData?.skills || 'None listed'}

Return ONLY a valid JSON object matching exactly this structure, with no markdown, no code blocks, and no extra text:
{
  "currentLevel": "",
  "targetRole": "",
  "estimatedDuration": "",
  "skillsToLearn": [],
  "projects": [],
  "certifications": [],
  "nextStep": ""
}

Limits:
- currentLevel: max 15 words
- estimatedDuration: max 8 words
- skillsToLearn: max 5 items
- projects: max 3 items
- certifications: max 3 items
- nextStep: max 15 words`;
    } else if (action === 'generate_interview_questions') {
      prompt = `Act as an expert interviewer for the role of ${interviewData?.targetRole || 'Unknown'} at ${interviewData?.experienceLevel || 'Fresher'} level.
Based on this resume and student details:
Department: ${interviewData?.department || 'Unknown'}
Skills: ${interviewData?.skills || 'None'}

Generate 5 interview questions tailored to their background.

Return ONLY a valid JSON object matching exactly this structure, with no markdown, no code blocks, and no extra text:
{
  "questions": []
}

Limits:
- questions: max 5 items
- Each question: max 18 words`;
    } else if (action === 'evaluate_interview_answer') {
      prompt = `Act as an expert interviewer for the role of ${interviewData?.targetRole || 'Unknown'} at ${interviewData?.experienceLevel || 'Fresher'} level.

Evaluate the following candidate's answer to this interview question.
Question: "${interviewData?.question}"
Candidate's Answer: "${interviewData?.answer}"

Return ONLY a valid JSON object matching exactly this structure, with no markdown, no code blocks, and no extra text:
{
  "score": 0,
  "feedback": "",
  "improvedAnswer": ""
}

Limits:
- score: number between 0 and 10
- feedback: max 25 words
- improvedAnswer: max 60 words`;
    } else if (isJobMatch) {
      prompt = `Compare this resume to the following job description:
Job Title: ${jobTitle || 'Unknown'}
Description: ${jobDescription}

Return ONLY a valid JSON object matching exactly this structure, with no markdown, no code blocks, and no extra text:
{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Limits:
- matchScore: number between 0 and 100
- matchedSkills: max 5 items
- missingSkills: max 5 items
- recommendations: max 5 items (max 10 words per recommendation)`;
    } else {
      prompt = `Analyze this resume and return ONLY a valid JSON object matching exactly this structure, with no markdown, no code blocks, and no extra text:
{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "missingSkills": [],
  "suggestions": []
}

Limits:
- atsScore: number between 0 and 100
- summary: max 40 words
- strengths: max 4 items
- missingSkills: max 5 items
- suggestions: max 5 items (max 12 words per suggestion)`;
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestParts: any[] = [{ text: prompt }];
    if (base64Pdf) {
      requestParts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Pdf
        }
      });
    }

    const requestBody = {
      contents: [
        {
          parts: requestParts
        }
      ]
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API Error:', errText);
      return new Response(JSON.stringify({ error: 'Failed to analyze resume with Gemini' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    let textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up potential markdown formatting if Gemini ignored instructions
    textResponse = textResponse.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/```$/, '').trim();
    
    let analysisJson;
    try {
      analysisJson = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', textResponse);
      return new Response(JSON.stringify({ error: 'Invalid analysis format returned by AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const skipDbActions = ['generate_referral', 'generate_roadmap', 'generate_interview_questions', 'evaluate_interview_answer'];

    if (skipDbActions.includes(action) || isJobMatch) {
      // For these ad-hoc actions, just return the JSON directly, don't save to DB
      return new Response(JSON.stringify(analysisJson), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Upsert into resume_analysis table (only for general resume analysis)
    const { data: upsertedAnalysis, error: upsertError } = await supabaseClient
      .from('resume_analysis')
      .upsert({
        resume_id: resumeId,
        overall_score: analysisJson.atsScore || 0,
        feedback_json: analysisJson,
      }, { onConflict: 'resume_id' })
      .select('overall_score, feedback_json')
      .single();

    if (upsertError) {
      console.error('Error saving analysis:', upsertError);
      return new Response(JSON.stringify({ error: 'Failed to save analysis results' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(upsertedAnalysis), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Internal Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
