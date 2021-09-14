import { useEffect, useRef } from "react";

export default function useUpdateOnly(callback, deps){

    const firstRender = useRef();

    useEffect(()=>{
        if(firstRender.currrent){
            firstRender.currrent = false;
            return
        }
        return callback();
    } ,deps)
}