import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile, Unsubscribe } from "firebase/auth";
import {
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
  } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweets";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile(){
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {files} = e.target;
        if(!user) return;
        if(files && files.length===1){
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl,
            })
        }

    }

    useEffect(()=>{
        let unsubscribe:Unsubscribe|null=null;

        const fetchTweets = async() => {
            // index 설정 미리 필요함
            const tweetQuery = query(
                collection(db, "tweets"),
                where("userId", "==", user?.uid),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            //const snapshot = await getDocs(tweetQuery);

            //realtime으로 변경
            //Snapshot 함수가 구독을 시작하면서, 해당 구독을 해제할 수 있는 함수를 반환. 그것을 unsubscribe에 담음
            unsubscribe = await onSnapshot(tweetQuery, (snapshot)=> {
                const tweets = snapshot.docs.map((doc)=>{
                    const {tweet, createdAt, userId, username, photo}=doc.data();
                    return {
                        tweet, createdAt, userId, username, photo,
                        id : doc.id,
                    };
                })
                setTweets(tweets);
            })
            
        };
        fetchTweets();

        
        return () => {
            // 이 부분이 "cleanup" 함수
            // 컴포넌트가 언마운트되거나 의존성이 변경되기 전에 실행

            // Teardown (해제), cleanup(정리)
            // 다른화면에 있을때 unsubscribe()를 실행시켜 DB사용하지 않도록 함
            unsubscribe && unsubscribe();
        }
    },[]);// 의존성 배열이 빈 경우, 컴포넌트가 언마운트될 때만 cleanup이 실행됨

    return (<Wrapper>
        <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ? <AvatarImg src={avatar}/> : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
        </AvatarUpload>
        <AvatarInput id="avatar" type="file" onChange={onAvatarChange} accept="image/*" />
        <Name>
            {user?.displayName ? user.displayName : "Anonymous"}
        </Name>
        <Tweets>
            {tweets.map(tweet => <Tweet key={tweet.id} {...tweet}/>)}
        </Tweets>
    </Wrapper>)
}