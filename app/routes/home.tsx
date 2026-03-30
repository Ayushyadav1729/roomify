import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {ArrowRight, ArrowUpRight, Clock, Layers} from "lucide-react"
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import {useNavigate} from "react-router";
import React, {useRef} from "react";
import {createProject} from "../../lib/puter.action";
import Projects from "./projects";
import {ReactCompareSlider, ReactCompareSliderImage} from "react-compare-slider";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Planora" },
    { name: "description", content: "Welcome to Planora!" },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    const isCreatingProjectRef = useRef(false);

    const handleUploadComplete = async (base64Image: string) => {
        try {
            if(isCreatingProjectRef.current) return false;
            isCreatingProjectRef.current = true;
            const newId = Date.now().toString();
            const name = `Residence ${newId}`;

            const newItem = {
                id: newId, name, sourceImage: base64Image,
                renderedImage: undefined,
                timestamp: Date.now()
            }

            const saved = await createProject({item: newItem, visibility: 'private'});
            if(!saved){
                console.error("Failed to create project");
                return false;
            }

            navigate(`/visualizer/${newId}`,{
                state: {
                    initialImage: saved.sourceImage,
                    initialRendered: saved.renderedImage || null,
                    name
                }
            });

            return true;
        } finally {
            isCreatingProjectRef.current =false;
        }
    };

  return (
      <div className="home">
      <Navbar/>
        <section className="hero">
            <div className="announce">
                <div className="dot">
                    <div className="pulse"></div>
                </div>

                <p>Introducing Planora </p>
            </div>

            <h1> Build beautiful spaces at the speed of
            thought with Planora</h1>

            <p className="subtitle">
                Planora is an AI-first design environment
                that helps you visualize, render, and ship
                architectural projects faster than ever.
            </p>

            <div className="actions">
                <a href="#upload" className="cta">
                    Start Building <ArrowRight
                    className={"icon"}/>
                </a>

                <Button variant="outline" size={"lg"}
                className={"demo"}>
                    Watch Demo
                </Button>
            </div>

            <div id={"upload"} className={"upload-shell"}>
                <div className={"grid-overlay"} />

                <div className={"upload-card"}>
                    <div className={"upload-head"}>
                        <div className={"upload-icon"}>
                            <Layers className={"icon"}/>
                        </div>

                        <h3>Upload your floor plan</h3>
                        <p>Supports JPG, PNG, formats up to
                        10MB</p>
                    </div>
                    <Upload onComplete={handleUploadComplete}/>
                </div>
            </div>
        </section>

          <section id="projects" className="projects">
              <div className="section-inner">

                  <div className="section-head">
                      <div className="copy">
                          <h2>Transforming 2D into 3D</h2>
                          <p>
                              See how your 2D floor plans transform into realistic 3D designs in just a few simple steps.
                          </p>
                      </div>
                  </div>

                  <div className="section-body">
                      <div className="panel compare rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-xl">

                          {/*<div className="panel-header">*/}
                          {/*    <div className="panel-meta">*/}
                          {/*        <p>Comparison</p>*/}
                          {/*        <h3>Before and After</h3>*/}
                          {/*    </div>*/}

                          {/*</div>*/}

                          <ReactCompareSlider
                              defaultValue={50}
                              style={{ width: "100%", height: "800px" }}
                              itemOne={
                                  <ReactCompareSliderImage
                                      src="/assets/images/before.jpg"
                                      alt="before"
                                      className="compare-img"
                                  />
                              }
                              itemTwo={
                                  <ReactCompareSliderImage
                                      src="/assets/images/after.png"
                                      alt="after"
                                      className="compare-img"
                                  />
                              }
                          />

                      </div>
                  </div>

              </div>
          </section>

      </div>
        )}
