import "./login.css";
import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Menu from "../../fragments/menu/menu";
import { authContext } from "../../helpers/authContext";
import { notification } from "antd";
import "antd/lib/notification/style/index.css";
import { useFormik } from "formik";
import { Modal } from "antd";
import { schemaForgot } from "../../schemas/schema";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(authContext);

  const [openForgot, setOpenForgot] = useState(false);
  const [confirmLoadingForgot, setConfirmLoadingForgot] = useState(false);

  //modal forgot password
  const showForgotModal = () => {
    setOpenForgot(true);
  };

  const handleCancelForgot = () => {
    setOpenForgot(false);
  };

  const forgotPass = async (values, actions) => {
    setConfirmLoadingForgot(true);
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/forgot-password", {
        email: values.email,
        
    });
    if (response.data.type === "error") {
      notification[response.data.type]({
        message: response.data.message,
        description: response.data.description,
      });
    }else{
    notification[response.data.type]({
      message: response.data.message,
      description: response.data.description,
    });
      setOpenForgot(false);
      actions.resetForm();
    }
    setConfirmLoadingForgot(false);
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: schemaForgot,
      onSubmit: forgotPass,
    });
  //

  const login = (event) => {
    event.preventDefault();
    Axios.post("https://daniel-licenta-api.herokuapp.com/login", {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.type === "error") {
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
      } else {
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
        localStorage.setItem("token", response.data.token);
        setAuthState({
          username: response.data.username,
          email: response.data.email,
          id: response.data.id,
          pfp_src: response.data.pfp_src,
          coins: response.data.coins,
          status: true,
        });
        navigate("/play");
      }
    });
  };

  return (
    <>
      <Menu />
      <Modal
        title="Forgot your password"
        bodyStyle={{ backgroundColor: "#303952" }}
        open={openForgot}
        onOk={handleSubmit}
        confirmLoading={confirmLoadingForgot}
        onCancel={handleCancelForgot}
      >
        <input
          type="text"
          placeholder="Email"
          id="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{width:"270px"}}
          className={errors.email && touched.email ? "input-error" : "email"}
        />
        {errors.email && touched.email && (
          <p className="error-message-forgot">{errors.email}</p>
        )}
      </Modal>

      <div className="container">
        <form name="form1" className="box">
          <h5>LOGIN INTO YOUR ACCOUNT</h5>
          <input
            type="text"
            placeholder="Email"
            autoComplete="on"
            className="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Passsword"
            autoComplete="off"
            className="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button onClick={login} className="btn1">
            Login
          </button>
        </form>
        <div className="forgot-new">
          <button onClick={showForgotModal} className="forgot-pass">
            <p>Forgot your password?</p>
          </button>
          <Link to="/register" className="dnthave">
            Need an account?
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
