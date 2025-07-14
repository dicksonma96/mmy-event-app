"use client";

import { useEffect, useState } from "react";
import useMcaStore from "../mcaStore";

function Login() {
  const [tableNo, setTableNo] = useState();
  const [seatNo, setSeatNo] = useState();
  const GetEventInfo = useMcaStore((state) => state.GetEventInfo);
  const setShowLogin = useMcaStore((state) => state.setShowLogin);
  const showLogin = useMcaStore((state) => state.showLogin);

  return showLogin ? (
    <div className="login_popup col">
      <div className="login_window col">
        <span
          className="material-symbols-outlined close_btn"
          onClick={() => {
            setShowLogin(false);
          }}
        >
          close
        </span>

        <h1 className="color1">
          Please enter your <br /> seat number
        </h1>

        <div className="seat_input row">
          <div className="col">
            <em>Table Number:</em>
            <TwoDigitInput value={tableNo} setValue={setTableNo} />
          </div>
          <strong>-</strong>
          <div className="col">
            <em>Seat Number:</em>
            <TwoDigitInput value={seatNo} setValue={setSeatNo} />
          </div>
        </div>
        <br />
        <button
          className="cta_btn"
          onClick={() => {
            GetEventInfo(`${tableNo}-${seatNo}`).then((res) => {
              if (res == true) setShowLogin(false);
            });
          }}
        >
          Submit
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}

const TwoDigitInput = ({ value, setValue }) => {
  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Remove any non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Trim to two digits
    if (inputValue.length > 2) {
      inputValue = inputValue.slice(0, 2);
    }

    setValue(inputValue);
  };

  const handleBlur = () => {
    // Prepend 0 if necessary and ensure the value is exactly two digits
    if (value?.length == 1) {
      setValue("0" + value);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      maxLength={2}
      required
    />
  );
};

export default Login;
