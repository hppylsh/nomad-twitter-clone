import { collection, getDocs, limit, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweets";
import { Unsubscribe } from "@firebase/util";

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}
  
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline(){
    const [tweets, setTweets] = useState<ITweet[]>([]);
    
    useEffect(()=>{
        let unsubscribe:Unsubscribe|null=null;

        const fetchTweets = async() => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(10)
            );
            /*
            const spanshot = await getDocs(tweetsQuery);
            const tweets = spanshot.docs.map((doc) => {
                const {tweet, createdAt, userId, username, photo}=doc.data();
                return {
                    tweet, createdAt, userId, username, photo,
                    id : doc.id,
                };
                setTweets(tweets);
            });*/
    
            //realtime으로 변경
            //Snapshot 함수가 구독을 시작하면서, 해당 구독을 해제할 수 있는 함수를 반환. 그것을 unsubscribe에 담음
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot)=> {
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
    
    return (
        <>
        <Wrapper>
            {tweets.map((tweet) => <Tweet key={tweet.id} {...tweet}/>)}
        </Wrapper>
        </>
    )
}