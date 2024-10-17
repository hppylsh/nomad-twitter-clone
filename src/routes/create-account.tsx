import { useState } from "react";
import {
    Form,
    Error,
    Input,
    Switcher,
    Title,
    Wrapper,
  } from "../components/auth-components";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";

export default function CreateAccount(){
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
          target: { name, value },
        } = e;
        if (name === "name") {
          setName(value);
        } else if (name === "email") {
          setEmail(value);
        } else if (name === "password") {
          setPassword(value);
        }
      };
      const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //console.log(name, email, password);
        if (isLoading || name === "" || email === "" || password === "") return;
        
        try{
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credentials.user, {
                displayName: name,
              });
              navigate("/"); // 페이지 이동
        } catch (e){
            setError('');
        }finally{
            setLoading(false);
        }
      }
    return (
        <Wrapper>
            <Title>Join 𝕏</Title>
            <Form onSubmit={onSubmit}>
            <Input
                onChange={onChange}
                name="name"
                value={name}
                placeholder="Name"
                type="text"
                required
            />
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
                value={isLoading ? "Loading..." : "Create Account"}
            />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    );
}