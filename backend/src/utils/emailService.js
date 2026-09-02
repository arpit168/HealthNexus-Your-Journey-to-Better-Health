import SendEmail from "../config/Email.js";

export const sendOTPEmail = async (to, otp) => {
  const subject = "OTP to reset your HealthNexus Password";

  const message = `
<body style="margin:0; padding:0; background: linear-gradient(145deg, #0b0e14 0%, #1a1f2c 100%); font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px; background:transparent;">
    <tr>
      <td align="center">

        <!-- Main Card – Dark & Glassmorphic -->
        <table width="640" cellpadding="0" cellspacing="0" style="background: rgba(18, 22, 33, 0.95); backdrop-filter: blur(10px); border-radius: 36px; overflow: hidden; box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(120, 80, 200, 0.3) inset, 0 0 30px rgba(100, 50, 200, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
          
          <!-- Header – Deep Cosmic Gradient with Glow -->
          <tr>
            <td align="center" style="padding:0; background: linear-gradient(135deg, #281c44 0%, #4a2675 50%, #702f8b 100%); position:relative; box-shadow: 0 8px 20px rgba(106, 13, 173, 0.6);">
              <!-- Top Accent Line (neon) -->
              <div style="height:6px; background: linear-gradient(90deg, #ff77e9, #9d4edd, #4361ee);"></div>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 30px 25px;">
                    <!-- Icon with glow -->
                    <div style="width:80px; height:80px; background: rgba(255,255,255,0.1); border-radius: 40px; display: inline-flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); margin-bottom: 15px; border: 2px solid rgba(255, 200, 255, 0.5); box-shadow: 0 0 30px #c77dff;">
                      <span style="font-size:38px; filter: drop-shadow(0 0 8px #ffaaff);">🔮</span>
                    </div>
                    <h1 style="margin:0; font-size:30px; color:#ffffff; font-weight:800; letter-spacing:-0.5px; text-shadow: 0 2px 10px #b77eff, 0 0 20px #a555ff;">
                      Security Verification
                    </h1>
                    <p style="margin:10px 0 0; font-size:16px; color: rgba(255,255,255,0.8); font-weight:300; letter-spacing:0.3px;">
                      one‑time password enclosed
                    </p>
                  </td>
                </tr>
              </table>
              <!-- Soft curved transition -->
              <div style="height:25px; background: #121621; border-radius: 40px 40px 0 0; margin-top:-5px; box-shadow: inset 0 8px 8px -8px rgba(0,0,0,0.6);"></div>
            </td>
          </tr>

          <!-- Body – Dark Themed Content -->
          <tr>
            <td style="padding:20px 40px 30px; color: #e2e8ff;">

              <p style="margin:0 0 15px; font-size:18px; font-weight:500; color: #cbb8ff;">
                Greetings,
              </p>

              <p style="margin:0 0 25px; font-size:16px; line-height:1.7; color: #b0c0e0;">
                You recently requested to reset your password. Use the following 
                <span style="color:#b77eff; font-weight:600;">One-Time Password</span> 
                to proceed. This code is highly sensitive – keep it secret.
              </p>

              <!-- OTP Card – Neon Glow -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                <tr>
                  <td align="center">
                    <div style="
                      display: inline-block;
                      background: #1d1b33;
                      padding: 28px 50px;
                      border-radius: 40px;
                      border: 2px solid #8f5eff;
                      box-shadow: 0 0 30px #7a3bef, inset 0 0 10px #7f4fff;
                    ">
                      <span style="font-size: 54px; font-weight: 800; letter-spacing: 14px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #dbb3ff, #a275ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 15px #b77eff;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Security – Info Cards (Dark) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #171c28; border-radius: 28px; padding: 20px 25px; border: 1px solid #2d2f5a; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 10px 20px -5px #090c15;">
                <tr>
                  <td valign="middle" width="45" style="padding-right:12px;">
                    <span style="font-size:32px; filter: drop-shadow(0 0 6px #8f5eff);">⌛</span>
                  </td>
                  <td>
                    <p style="margin:0; font-size:16px; font-weight:600; color: #b9a6ff;">Valid for 5 minutes</p>
                    <p style="margin:4px 0 0; font-size:14px; color: #8b98b3;">Expires soon – do not delay.</p>
                  </td>
                </tr>
                <tr><td colspan="2" style="height:15px; border-bottom:1px dashed #2f3650;"></td></tr>
                <tr>
                  <td valign="middle" width="45" style="padding-right:12px; padding-top:10px;">
                    <span style="font-size:32px; filter: drop-shadow(0 0 6px #c351ff);">🛡️</span>
                  </td>
                  <td style="padding-top:10px;">
                    <p style="margin:0; font-size:16px; font-weight:600; color: #b9a6ff;">Never share this code</p>
                    <p style="margin:4px 0 0; font-size:14px; color: #8b98b3;">HealthNexus staff will never ask for your OTP.</p>
                  </td>
                </tr>
              </table>

              <!-- Extra notice with subtle glow -->
              <p style="margin:25px 0 0; font-size:14px; color: #a0adcc; background: #10131f; padding:16px 22px; border-radius: 26px; border-left: 6px solid #9a5eff; box-shadow: inset 0 1px 3px #00000055;">
                ⚡ If this wasn’t you, simply ignore this email. Your password remains unchanged.
              </p>

            </td>
          </tr>

          <!-- Footer – Dark Gradient -->
          <tr>
            <td align="center" style="padding:25px 30px; background: linear-gradient(145deg, #0b0e1a, #151b2b); border-top: 2px solid #2e2650;">
              <p style="margin:0 0 8px; font-size:15px; font-weight:500; color: #a290d0;">
                HealthNexus India Pvt. Ltd.
              </p>
              <p style="margin:0; font-size:13px; color: #5e6b94;">
                © ${new Date().getFullYear()} All rights reserved.
              </p>
              <p style="margin:12px 0 0; font-size:13px; color: #6f7da5;">
                Need help? <a href="mailto:support@healthnexus.in" style="color:#b77eff; text-decoration:none; font-weight:500; border-bottom:1px dotted #b77eff;">support@healthnexus.in</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
`;

  await SendEmail(to, subject, message);
};
