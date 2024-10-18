import { useState } from "react";
import {
    Form,
    Error,
    Input,
    Switcher,
    Title,
    Wrapper,
  } from "../components/auth-components";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import GithubButton from "../components/github-btn";

export default function Login(){
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
          target: { name, value },
        } = e;
        if (name === "email") {
          setEmail(value);
        } else if (name === "password") {
          setPassword(value);
        }
      };
      const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('')
        if (isLoading || email === "" || password === "") return;
        
        try{
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // 리디렉션 페이지 이동
        } catch (e){
            setError(e.message);
        }finally{
            setLoading(false);
        }
      }
    return (
        <Wrapper>
            <Title>Login 𝕏</Title>
            <Form onSubmit={onSubmit}>
        
            <Input
                onChange={onChange}
                name="email"
                value={email}
                placeholder="Email"
                type="email"
                required
            />
            <Input
                onChange={onChange}
                name="password"
                value={password}
                placeholder="Password"
                type="password"
                required
            />
            <Input
                type="submit"
                value={isLoading ? "Loading..." : "Login"}
            />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't have an account?{" "}
                <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <GithubButton/>
        </Wrapper>
    );
}