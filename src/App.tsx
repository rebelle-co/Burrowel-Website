import ResetPasswordPage
  from "./pages/ResetPasswordPage";


function App() {

  const pathname =
    window.location.pathname;


  if (
    pathname ===
    "/reset-password"
  ) {

    return (
      <ResetPasswordPage />
    );

  }


  return (

    <div>
      Burrowel
    </div>

  );

}


export default App;