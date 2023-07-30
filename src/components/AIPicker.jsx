import React from 'react';
import {CustomButton} from "./index.js";

const AiPicker = ({prompt, setPrompt, generatingImg, handleSubmit}) => {
    return (<div className="aipicker-container">
            <textarea
                placeholder="Ask AI..."
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="aipicker-textarea"
            />
        <div className="flex flex-wrap gap-4">
            {generatingImg ? (<CustomButton
                type="outlined"
                title="AI is working..."
                customStyles="text-xs font-bold"
            />) : (<>
                <CustomButton
                    type="outlined"
                    title="AI Logo"
                    handleClick={() => handleSubmit("logo")}
                    customStyles="text-xs font-bold"
                />
                <CustomButton
                    type="filled"
                    title="AI Full"
                    handleClick={() => handleSubmit("full")}
                    customStyles="text-xs font-bold"
                />
            </>)}
        </div>
    </div>);
};

export default AiPicker;
