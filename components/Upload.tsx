import React, { useEffect, useRef, useState } from 'react'
import {useOutletContext} from "react-router";
import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import {
    PROGRESS_INTERVAL_MS,
    PROGRESS_STEP,
    REDIRECT_DELAY_MS,
} from "../lib/constants";

type UploadProps = {
    onComplete?: (base64Data: string) => void;
};

const Upload = ({ onComplete }: UploadProps) =>{
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { isSignedIn } = useOutletContext<AuthContext>();

    const clearUploadTimers = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            clearUploadTimers();
        };
    }, []);

    const processFile = (selectedFile: File) => {
        if (!isSignedIn) return;

        clearUploadTimers();
        setFile(selectedFile);
        setProgress(0);

        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = typeof reader.result === "string" ? reader.result : "";

            if (!base64Data) return;

            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    const next = Math.min(prev + PROGRESS_STEP, 100);

                    if (next === 100) {
                        clearUploadTimers();
                        timeoutRef.current = setTimeout(() => {
                            onComplete?.(base64Data);
                        }, REDIRECT_DELAY_MS);
                    }

                    return next;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.readAsDataURL(selectedFile);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;

        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        processFile(selectedFile);
        event.target.value = "";
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) return;

        const droppedFile = event.dataTransfer.files?.[0];
        if (!droppedFile) return;

        processFile(droppedFile);
    };

    return (
        <div className={"upload"}>
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                    type={"file"}
                    className={"drop-input"}
                    accept={".jpg,.jpeg,.png"}
                    disabled={!isSignedIn}
                    onChange={onChange}
                    />

                    <div className={"drop-content"}>
                        <div className={"drop-icon"}>
                            <UploadIcon size={20}/>
                        </div>
                        <p>
                            {isSignedIn ? (
                                "Click to upload or just drag and drop"
                            ):("Sign in or sign up with Puter to upload")}
                        </p>
                        <p className={"help"}>Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                  <div className={"upload-status"}>
                      <div className={"status-content"}>
                          <div className={"status-icon"}>
                              {progress === 100 ? (
                                  <CheckCircle2 className={"check"}/>
                              ):(
                                  <ImageIcon className={"image"}/>
                              )}
                          </div>

                          <h3>{file.name}</h3>

                          <div className={"progress"}>
                              <div className={"bar"} style={{width:`${progress}%`}}/>

                              <p className={"status-text"}>
                                  {progress < 100 ? 'Analyzing Floor Plan...': 'Redirecting ...'}
                              </p>
                          </div>
                      </div>
                  </div>  )}
        </div>
    )
}

export default Upload
