import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
const Login = () => {
  const [users, setUser] = useState({
    user_name: "",
    password: "",
  });
  const navigate = useNavigate();
  const handelchange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handelclick = async (e) => {
    e.preventDefault();
    await axios
      .post("/login", users)
      .then((res) => {
        if (res.data.Login) {
          navigate(`/${res.data.role}`);
        } else {
          alert("Invalid Password or Username");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="m-5">
      <div id="" className="m-5">
        <div className="container-fluid">
          <div className="authentication-inner">
           
            <div className="card">
              <div className="card-body">
                <h4 className="mb-2">Welcome ! 👋</h4>

                <form
                  id="formAuthentication"
                  className="mb-3"
                  action="index.html"
                  method="POST"
                >
                  <div className="row g-3">
                    {" "}
                    <div className="mb-3 col">
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="user_name"
                        placeholder="Enter your username"
                        autofocus
                        onChange={handelchange}
                      />
                    </div>
                    <div className="mb-3 col form-password-toggle">
                      <div className="input-group input-group-merge">
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          name="password"
                          placeholder="············"
                          aria-describedby="password"
                          onChange={handelchange}
                        />
                        <span className="input-group-text cursor-pointer">
                          <i className="bx bx-hide" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <button
                      className="btn btn-primary d-grid w-100"
                      type="submit"
                      onClick={handelclick}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
