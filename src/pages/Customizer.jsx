import React, {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useSnapshot} from "valtio";
import state from "../store";
import {DecalTypes, EditorTabs, FilterTabs} from "../config/constants.js";
import {fadeAnimation, slideAnimation} from "../config/motion.js";
import {AIPicker, ColorPicker, CustomButton, FilePicker, Tab} from "../components";
import {downloadCanvasToImage, reader} from "../config/helpers.js";
import {download} from "../assets/index.js";

const Customizer = () => {
    const snap = useSnapshot(state);

    const [generatingImg, setGeneratingImg] = useState(false);
    const [file, setFile] = useState("");
    const [prompt, setPrompt] = useState("");

    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true, stylishShirt: false,
    });

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;

        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName]
                break
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName]
                break
            default:
                state.isLogoTexture = true
                state.isFullTexture = false
        }

        // updating the state after setting the active tab
        setActiveFilterTab((prevState) => {
            return {
                ...prevState, [tabName]: !prevState[tabName],
            }
        })
    }

    const readFile = (type) => {
        reader(file)
            .then((result) => {
                handleDecals(type, result);
                setActiveEditorTab("");
            })
    }

    const handleSubmit = async (type) => {
        if (!prompt) return alert("Please enter a prompt!");

        try {
            setGeneratingImg(true);

            const response = await fetch("http://localhost:8000/api/v1/dalle", {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    prompt,
                }),
            });

            const data = await response.json();

            handleDecals(type, `data:image/png;base64,${data.photo}`)

        } catch (error) {
            alert("Something went wrong!" + error);
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    const generateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker/>;
            case "filepicker":
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />;
            case "aipicker":
                return <AIPicker
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />;
            default:
                return null;
        }
    }

    return (<AnimatePresence>
        {!snap.intro && (<>
            <motion.div
                key="custom"
                className="absolute top-0 left-0 z-0"
                {...slideAnimation("left")}
            >
                <div className="flex items-center min-h-screen">
                    <div className="editortabs-container tabs">
                        {EditorTabs.map((tab) => (<Tab
                            key={tab.name}
                            tab={tab}
                            handleClick={() => {
                                setActiveEditorTab(tab.name)
                            }}
                        />))}
                        {generateTabContent()}
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="absolute z-10 top-5 right-5"
                {...fadeAnimation}
            >
                <CustomButton
                    type="filled"
                    title="Go back"
                    handleClick={() => state.intro = true}
                    customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                />
            </motion.div>
            <motion.div
                className="filtertabs-container"
                {...slideAnimation("up")}
            >
                {FilterTabs.map((tab) => (<Tab
                    key={tab.name}
                    tab={tab}
                    isFilterTab
                    isActive={activeFilterTab[tab.name]}
                    handleClick={() => {
                        handleActiveFilterTab(tab.name)
                    }}
                />))}
                <Tab
                    key="download"
                    tab={{
                        name: "download", icon: download,
                    }}
                    handleClick={downloadCanvasToImage}
                />
            </motion.div>
        </>)}

    </AnimatePresence>);
};

export default Customizer;
