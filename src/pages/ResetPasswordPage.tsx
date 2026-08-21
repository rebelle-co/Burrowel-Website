import {
  useEffect,
  useState
} from "react";

import {
  supabase
} from "../lib/supabase";


export default function ResetPasswordPage() {

  const [
    newPassword,
    setNewPassword
  ] =
    useState("");


  const [
    confirmPassword,
    setConfirmPassword
  ] =
    useState("");


  const [
    loading,
    setLoading
  ] =
    useState(false);


  const [
    ready,
    setReady
  ] =
    useState(false);


  const [
    success,
    setSuccess
  ] =
    useState(false);


  const [
    error,
    setError
  ] =
    useState<string | null>(
      null
    );


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


  async function handleSubmit() {

    if (
      loading
    ) {

      return;

    }


    setError(
      null
    );


    if (
      newPassword.length < 6
    ) {

      setError(
        "Your password must contain at least 6 characters."
      );


      return;

    }


    if (
      newPassword !==
      confirmPassword
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


  if (
    success
  ) {

    return (

      <div
        className="reset-password-page"
      >

        <div
          className="reset-password-card"
        >

          <h1>
            Password changed
          </h1>


          <p>
            Your Burrowel password has
            been changed successfully.
          </p>

        </div>

      </div>

    );

  }


  if (
    error &&
    !ready
  ) {

    return (

      <div
        className="reset-password-page"
      >

        <div
          className="reset-password-card"
        >

          <h1>
            Reset password
          </h1>


          <p
            className="reset-password-error"
          >
            {error}
          </p>

        </div>

      </div>

    );

  }


  if (
    !ready
  ) {

    return (

      <div
        className="reset-password-page"
      >

        <div
          className="reset-password-card"
        >

          <h1>
            Reset password
          </h1>


          <p>
            Verifying your password reset link...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div
      className="reset-password-page"
    >

      <div
        className="reset-password-card"
      >

        <h1>
          Reset your password
        </h1>


        <p>
          Choose a new password for your
          Burrowel account.
        </p>


        <div
          className="reset-password-form"
        >

          <label>
            New password
          </label>


          <input
            type="password"
            value={newPassword}
            placeholder="Enter your new password"
            disabled={loading}
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


          <label>
            Confirm new password
          </label>


          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm your new password"
            disabled={loading}
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


          {error && (

            <div
              className="reset-password-error"
            >

              {error}

            </div>

          )}


          <button
            type="button"
            disabled={
              loading ||
              !newPassword ||
              !confirmPassword
            }
            onClick={
              handleSubmit
            }
          >

            {loading
              ? "Changing..."
              : "Change password"
            }

          </button>

        </div>

      </div>

    </div>

  );

}