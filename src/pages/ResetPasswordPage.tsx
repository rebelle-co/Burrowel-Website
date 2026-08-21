import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";

import {
  supabase
} from "../lib/supabase";

import "./ResetPasswordPage.css";


export default function ResetPasswordPage() {

  const [
    newPassword,
    setNewPassword
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");


  const [
    showPassword,
    setShowPassword
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    ready,
    setReady
  ] = useState(false);


  const [
    success,
    setSuccess
  ] = useState(false);


  const [
    error,
    setError
  ] = useState<string | null>(null);


  // =====================================
  // PASSWORD REQUIREMENTS
  // =====================================

  const passwordRequirements = useMemo(() => {

    return {

      length:
        newPassword.length >= 8,

      lowercase:
        /[a-z]/.test(newPassword),

      uppercase:
        /[A-Z]/.test(newPassword),

      number:
        /[0-9]/.test(newPassword)

    };

  }, [
    newPassword
  ]);


  const passwordIsValid =
    passwordRequirements.length &&
    passwordRequirements.lowercase &&
    passwordRequirements.uppercase &&
    passwordRequirements.number;


  const passwordsMatch =
    newPassword.length > 0 &&
    newPassword === confirmPassword;


  // =====================================
  // PASSWORD STRENGTH
  // =====================================

  const passwordStrength = useMemo(() => {

    let score = 0;

    if (
      passwordRequirements.length
    ) score++;

    if (
      passwordRequirements.lowercase
    ) score++;

    if (
      passwordRequirements.uppercase
    ) score++;

    if (
      passwordRequirements.number
    ) score++;


    if (
      newPassword.length >= 12
    ) {
      score++;
    }


    return score;

  }, [
    newPassword,
    passwordRequirements
  ]);


  // =====================================
  // INITIALIZE RECOVERY SESSION
  // =====================================

  useEffect(() => {

    let mounted = true;


    const {
      data: listener
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          console.log(
            "SUPABASE AUTH EVENT:",
            event
          );


          if (
            event ===
            "PASSWORD_RECOVERY"
          ) {

            if (
              mounted
            ) {

              setReady(
                !!session
              );

            }

            return;

          }


          if (
            event ===
            "SIGNED_IN"
          ) {

            const {
              data
            } =
              await supabase.auth.getSession();


            if (
              mounted
            ) {

              setReady(
                !!data.session
              );

            }

          }

        }
      );


    const initialize =
      async () => {

        const {
          data,
          error
        } =
          await supabase.auth.getSession();


        if (
          error
        ) {

          console.error(
            "RESET SESSION ERROR:",
            error
          );


          if (
            mounted
          ) {

            setError(
              "This password reset link is invalid or has expired."
            );

          }


          return;

        }


        if (
          data.session &&
          mounted
        ) {

          setReady(
            true
          );

        }

      };


    initialize();


    return () => {

      mounted = false;

      listener.subscription.unsubscribe();

    };

  }, []);


  // =====================================
  // SUBMIT
  // =====================================

  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();


    if (
      loading
    ) {

      return;

    }


    setError(
      null
    );


    if (
      !passwordIsValid
    ) {

      setError(
        "Please choose a stronger password."
      );

      return;

    }


    if (
      !passwordsMatch
    ) {

      setError(
        "The passwords do not match."
      );

      return;

    }


    setLoading(
      true
    );


    const {
      error
    } =
      await supabase.auth.updateUser({
        password:
          newPassword
      });


    if (
      error
    ) {

      console.error(
        "PASSWORD UPDATE ERROR:",
        error
      );


      setError(
        error.message
      );


      setLoading(
        false
      );

      return;

    }


    console.log(
      "PASSWORD UPDATED SUCCESSFULLY"
    );


    setSuccess(
      true
    );


    setLoading(
      false
    );

  }


  // =====================================
  // SUCCESS
  // =====================================

  if (
    success
  ) {

    return (

      <div
        className="reset-password-page"
      >

        <div
          className="reset-password-card reset-password-success-card"
        >

          <div
            className="reset-password-success-icon"
          >

            <Check
              size={24}
              strokeWidth={2}
            />

          </div>


          <h1>
            Password changed
          </h1>


          <p className="reset-password-description">

            Your Burrowel password has been
            changed successfully.

          </p>


          <a
            className="reset-password-submit"
            href="https://burrowel.com"
          >
            Return to Burrowel
          </a>

        </div>

      </div>

    );

  }


  // =====================================
  // INVALID / EXPIRED LINK
  // =====================================

  if (
    error &&
    !ready
  ) {

    return (

      <div
        className="reset-password-page"
      >

        <div
          className="reset-password-card reset-password-error-card"
        >

          <div
            className="reset-password-error-icon"
          >
            !
          </div>


          <h1>
            Reset link expired
          </h1>


          <p className="reset-password-description">

            This password reset link is invalid
            or has expired.

          </p>


          <a
            className="reset-password-submit"
            href="https://burrowel.com"
          >
            Return to Burrowel
          </a>

        </div>

      </div>

    );

  }


  // =====================================
  // VERIFYING
  // =====================================

  if (
    !ready
  ) {

    return (

      <div
        className="reset-password-page"
      >

        <div
          className="reset-password-card reset-password-loading-card"
        >

          <div
            className="reset-password-loading-spinner"
          />


          <h1>
            Verifying your link
          </h1>


          <p className="reset-password-description">

            Please wait while we verify your
            password reset request.

          </p>

        </div>

      </div>

    );

  }


  // =====================================
  // RESET FORM
  // =====================================

  return (

    <div
      className="reset-password-page"
    >

      <div
        className="reset-password-card"
      >

        <div
          className="reset-password-brand"
        >
          Burrowel
        </div>


        <div
          className="reset-password-icon"
        >

          <ShieldCheck
            size={22}
            strokeWidth={1.8}
          />

        </div>


        <h1>
          Create a new password
        </h1>


        <p className="reset-password-description">

          Choose a strong password to keep your
          Burrowel account secure.

        </p>


        <form
          className="reset-password-form"
          onSubmit={
            handleSubmit
          }
        >

          <div
            className="reset-password-field"
          >

            <label htmlFor="new-password">
              New password
            </label>


            <div
              className="reset-password-input-wrapper"
            >

              <input
                id="new-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  newPassword
                }
                placeholder="Enter your new password"
                disabled={
                  loading
                }
                autoComplete="new-password"
                onChange={(
                  event
                ) => {

                  setNewPassword(
                    event.target.value
                  );

                  setError(
                    null
                  );

                }}
              />


              <button
                type="button"
                className="reset-password-eye"
                tabIndex={-1}
                onClick={() =>
                  setShowPassword(
                    value => !value
                  )
                }
              >

                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}

              </button>

            </div>

          </div>


          {newPassword && (

            <div
              className="reset-password-strength"
            >

              <div
                className="reset-password-strength-bars"
              >

                {[1, 2, 3, 4].map(
                  level => (

                    <span
                      key={level}
                      className={
                        passwordStrength >= level
                          ? "active"
                          : ""
                      }
                    />

                  )
                )}

              </div>


              <span>

                {passwordStrength <= 1
                  ? "Weak"
                  : passwordStrength === 2
                    ? "Fair"
                    : passwordStrength === 3
                      ? "Good"
                      : "Strong"
                }

              </span>

            </div>

          )}


          <div
            className="reset-password-requirements"
          >

            <div
              className={
                passwordRequirements.length
                  ? "valid"
                  : ""
              }
            >

              <Check size={13} />

              At least 8 characters

            </div>


            <div
              className={
                passwordRequirements.uppercase
                  ? "valid"
                  : ""
              }
            >

              <Check size={13} />

              One uppercase letter

            </div>


            <div
              className={
                passwordRequirements.lowercase
                  ? "valid"
                  : ""
              }
            >

              <Check size={13} />

              One lowercase letter

            </div>


            <div
              className={
                passwordRequirements.number
                  ? "valid"
                  : ""
              }
            >

              <Check size={13} />

              One number

            </div>

          </div>


          <div
            className="reset-password-field"
          >

            <label htmlFor="confirm-password">
              Confirm new password
            </label>


            <div
              className="reset-password-input-wrapper"
            >

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmPassword
                }
                placeholder="Confirm your new password"
                disabled={
                  loading
                }
                autoComplete="new-password"
                onChange={(
                  event
                ) => {

                  setConfirmPassword(
                    event.target.value
                  );

                  setError(
                    null
                  );

                }}
              />


              <button
                type="button"
                className="reset-password-eye"
                tabIndex={-1}
                onClick={() =>
                  setShowConfirmPassword(
                    value => !value
                  )
                }
              >

                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}

              </button>

            </div>

          </div>


          {confirmPassword && (
            <div
              className={
                passwordsMatch
                  ? "reset-password-match valid"
                  : "reset-password-match"
              }
            >

              <Check size={13} />

              {passwordsMatch
                ? "Passwords match"
                : "Passwords do not match"
              }

            </div>
          )}


          {error && (

            <div
              className="reset-password-error"
            >

              {error}

            </div>

          )}


          <button
            type="submit"
            className="reset-password-submit"
            disabled={
              loading ||
              !passwordIsValid ||
              !passwordsMatch
            }
          >

            {loading
              ? "Changing password..."
              : "Change password"
            }

          </button>

        </form>


        <p
          className="reset-password-security"
        >

          Your password is securely managed
          by Burrowel.

        </p>

      </div>

    </div>

  );

}