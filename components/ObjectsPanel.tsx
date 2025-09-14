/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import type { DetectedObject } from '../App';
import { BullseyeIcon } from './icons';
import Spinner from './Spinner';

interface ObjectsPanelProps {
    onDetect: () => void;
    onGenerate: (prompt: string) => void;
    isDetecting: boolean;
    isLoading: boolean;
    objects: DetectedObject[] | null;
    selectedObject: DetectedObject | null;
    onObjectSelect: (object: DetectedObject | null) => void;
    onObjectHover: (object: DetectedObject | null) => void;
}

const ObjectsPanel: React.FC<ObjectsPanelProps> = ({ 
    onDetect, 
    onGenerate,
    isDetecting, 
    isLoading,
    objects,
    selectedObject,
    onObjectSelect,
    onObjectHover
}) => {
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        // Clear prompt when selection changes
        setPrompt('');
    }, [selectedObject]);
    
    const handleSelect = (object: DetectedObject) => {
        if (selectedObject === object) {
            onObjectSelect(null); // Deselect if clicking the same object
        } else {
            onObjectSelect(object);
        }
    };

    const renderContent = () => {
        if (isDetecting) {
            return (
                <div className="text-center text-gray-400 py-4">
                    <Spinner />
                    <p>Detecting objects...</p>
                </div>
            );
        }

        if (!objects) {
            return (
                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-lg font-semibold text-center text-gray-300">Detect Objects in Your Image</h3>
                    <p className="text-sm text-gray-400 -mt-2 text-center max-w-md">
                        Let AI automatically find and outline objects, making it easy to select and edit them with precision.
                    </p>
                    <button
                        onClick={onDetect}
                        disabled={isDetecting}
                        className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <BullseyeIcon className="w-5 h-5" />
                        Detect Objects
                    </button>
                </div>
            );
        }

        if (objects.length === 0) {
            return <p className="text-center text-gray-400 py-4">No distinct objects were detected in this image.</p>;
        }

        return (
            <div className="flex flex-col gap-4">
                <p className="text-md text-gray-400 text-center">
                    {selectedObject ? 'Great! Now describe your edit below.' : 'Hover to see, or click to select an object to edit.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-2">
                    {objects.map((obj, index) => (
                        <button
                            key={`${obj.name}-${index}`}
                            onClick={() => handleSelect(obj)}
                            onMouseEnter={() => onObjectHover(obj)}
                            onMouseLeave={() => onObjectHover(null)}
                            disabled={isLoading}
                            className={`w-full text-center capitalize bg-white/5 border text-gray-200 font-semibold py-3 px-2 rounded-md transition-all duration-200 ease-in-out hover:bg-white/10 hover:border-blue-400 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${selectedObject === obj ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-500/10' : 'border-white/20'}`}
                        >
                            {obj.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
            {renderContent()}
            
            {selectedObject && (
                 <form 
                    onSubmit={(e) => { e.preventDefault(); onGenerate(prompt); }} 
                    className="w-full flex items-center gap-2 animate-fade-in mt-2"
                >
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`e.g., 'remove this ${selectedObject.name.toLowerCase()}'`}
                        className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-5 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-5 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                        disabled={isLoading || !prompt.trim()}
                    >
                        Generate
                    </button>
                </form>
            )}
        </div>
    );
};

export default ObjectsPanel;