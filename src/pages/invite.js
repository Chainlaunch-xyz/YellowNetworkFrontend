import BusinessCard from "@/components/BusinessCard";
import InviteCard from "@/components/InviteCard";
import { useEffect, useState } from "react";

export default function Invite() {
    return (
        <div className="w-100% flex min-h-screen justify-center gap-4" style={{ fontFamily: 'American Typewriter' }}>
            <div className="w-[70%] flex flex-col items-center mb-8">
                <div className="flex items-center  border-black border-2 justify-center bg-white text-center w-[40%] h-auto p-2 text-xl mb-16">Invite Friends (0/5)</div>
                <div className="flex items-center justify-center text-center w-[40%] h-16 text-xl mb-4">Extended Network</div>
                <div className="bg-white flex flex-col w-auto min-w-[30%] gap-y-4 justify-center"> 
                <InviteCard />
                <InviteCard />
                <InviteCard />
                <InviteCard />
                </div>
            </div>
        </div>
            
    );
}
  