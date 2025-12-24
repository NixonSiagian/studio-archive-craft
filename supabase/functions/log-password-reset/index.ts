import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetRequest {
  email: string;
  redirectTo: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  try {
    const { email, redirectTo }: ResetRequest = await req.json();

    console.log(`[${requestId}] Password reset requested`, {
      timestamp,
      email: email ? `${email.substring(0, 3)}...@...` : "missing",
      redirectTo,
    });

    if (!email) {
      console.error(`[${requestId}] Missing email in request`);
      return new Response(
        JSON.stringify({ error: "Email is required", requestId }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Send password reset email using Supabase Auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error(`[${requestId}] Supabase auth error:`, {
        message: error.message,
        status: error.status,
      });

      // Check for rate limiting
      if (error.message.toLowerCase().includes("rate") || error.status === 429) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "rate_limited",
            message: "Too many requests. Please wait a few minutes before trying again.",
            requestId,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Generic error response (don't reveal if account exists or not)
      return new Response(
        JSON.stringify({
          success: true,
          message: "If an account exists with this email, a reset link has been sent.",
          requestId,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`[${requestId}] Password reset email sent successfully`, {
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
        requestId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error(`[${requestId}] Unexpected error in password reset:`, {
      error: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: "server_error",
        message: "An unexpected error occurred. Please try again later.",
        requestId,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
