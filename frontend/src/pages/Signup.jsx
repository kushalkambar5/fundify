import React, { useState } from "react";
import Signup1 from "./Signup1";
import Signup2 from "./Signup2";
import Signup3 from "./Signup3";

function Signup() {
  const [step, setStep] = useState(1);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const handleNextStep1 = (email, pass) => {
    if (email) setEmailId(email);
    if (pass) setPassword(pass);
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  return (
    <>
      {step === 1 && <Signup1 onNext={handleNextStep1} />}
      {step === 2 && <Signup2 onNext={handleNextStep2} email={emailId} />}
      {step === 3 && <Signup3 emailId={emailId} password={password} />}
    </>
  );
}

export default Signup;
