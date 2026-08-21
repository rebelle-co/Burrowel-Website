import {
  useEffect,
  useState
} from "react";

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


  useEffect(() => {

    let mounted = true;


    const initialize = async () => {

      const {
        data,
        error
      } = await supabase.auth.getSession();


      if (!mounted) {
        return;
      }


      if (error) {

        console.error(
          "RESET SESSION ERROR:",
          error
        );

        setError(
          "This password reset link is invalid or has expired."
        );

        return;

      }


      if (data.session) {

        setReady(true);

      }

    };


    initialize();


    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      async (
        event,
        session
      ) => {

        console.log(
          "SUPABASE AUTH EVENT:",
          event
        );


        if (!mounted) {
          return;
        }


        if (
          event === "PASSWORD_RECOVERY"
        ) {

          setReady(
            !!session
          );

          return;

        }


        if (
          event === "SIGNED_IN"
        ) {

          const {
            data
          } = await supabase.auth.getSession();


          if (!mounted) {
            return;
          }


          setReady(
            !!data.session
          );

        }

      }
    );


    return () => {

      mounted = false;

      listener.subscription.unsubscribe();

    };

  }, []);


  async function handleSubmit() {

    if (loading) {
      return;
    }


    setError(null);


    if (newPassword.length < 6) {

      setError(
        "Your password must contain at least 6 characters."
      );

      return;

    }


    if (newPassword !== confirmPassword) {

      setError(
        "The passwords do not match."
      );

      return;

    }


    setLoading(true);


    const {
      error
    } = await supabase.auth.updateUser({
      password: newPassword
    });


    if (error) {

      console.error(
        "PASSWORD UPDATE ERROR:",
        error
      );

      setError(
        error.message
      );

      setLoading(false);

      return;

    }


    console.log(
      "PASSWORD UPDATED SUCCESSFULLY"
    );


    setSuccess(true);

    setLoading(false);

  }


  if (success) {

    return (

      <main className="reset-password-page">

        <section className="reset-password-card reset-password-success-card">

          <div className="reset-password-logo">
            B
          </div>


          <div className="reset-password-success-icon">
            ✓
          </div>


          <h1>
            Password changed
          </h1>


          <p className="reset-password-description">
            Your Burrowel password has been
            changed successfully.
          </p>


          <p className="reset-password-success-message">
            You can now close this page and
            sign in to Burrowel with your new
            password.
          </p>

        </section>

      </main>

    );

  }


  if (error && !ready) {

    return (

      <main className="reset-password-page">

        <section className="reset-password-card">

          <div className="reset-password-logo">
            B
          </div>


          <div className="reset-password-status-icon reset-password-status-error">
            !
          </div>


          <h1>
            Reset password
          </h1>


          <p className="reset-password-description">
            We couldn't verify your password
            reset link.
          </p>


          <div className="reset-password-error">
            {error}
          </div>

        </section>

      </main>

    );

  }


  if (!ready) {

    return (

      <main className="reset-password-page">

        <section className="reset-password-card">

          <div className="reset-password-logo">
            B
          </div>


          <div className="reset-password-loader">
            <div />
          </div>


          <h1>
            Reset your password
          </h1>


          <p className="reset-password-description">
            Verifying your password reset link...
          </p>

        </section>

      </main>

    );

  }


  return (

    <main className="reset-password-page">

      <section className="reset-password-card">

        <div className="reset-password-logo">
          B
        </div>


        <h1>
          Reset your password
        </h1>


        <p className="reset-password-description">
          Choose a new password for your
          Burrowel account.
        </p>


        <form
          className="reset-password-form"
          onSubmit={(event) => {

            event.preventDefault();

            handleSubmit();

          }}
        >

          <div className="reset-password-field">

            <label htmlFor="new-password">
              New password
            </label>


            <input
              id="new-password"
              type="password"
              value={newPassword}
              placeholder="Enter your new password"
              autoComplete="new-password"
              disabled={loading}
              onChange={(event) => {

                setNewPassword(
                  event.target.value
                );

                setError(null);

              }}
            />

          </div>


          <div className="reset-password-field">

            <label htmlFor="confirm-password">
              Confirm new password
            </label>


            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={loading}
              onChange={(event) => {

                setConfirmPassword(
                  event.target.value
                );

                setError(null);

              }}
            />

          </div>


          <p className="reset-password-hint">
            Your password must contain at least
            6 characters.
          </p>


          {error && (

            <div className="reset-password-error">
              {error}
            </div>

          )}


          <button
            className="reset-password-submit"
            type="submit"
            disabled={
              loading ||
              !newPassword ||
              !confirmPassword
            }
          >

            {loading
              ? "Changing password..."
              : "Change password"
            }

          </button>

        </form>


        <p className="reset-password-footer">
          Burrowel account security
        </p>

      </section>

    </main>

  );

}