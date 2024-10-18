import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
import { auth } from "../firebase";

export default function Home(){
    const logOut = () => {
        auth.signOut();
    };
    return (
        <>
            <PostTweetForm/> 
            <div></div><Timeline/>
            <h1><button onClick={logOut}>Logout</button></h1>
        </>
    );
}