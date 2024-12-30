import React, { createContext, useState } from "react";

import executeOpenSCAD from "../../lib/openSCAD/execute";
import { WorkerMessageType } from "../../worker/types";

// Create a context for the web worker
const OpenSCADWorkerContext = createContext<{
	execExport?: (code: string) => Promise<File>;
	isExporting?: boolean;
	log?: string[];
	preview?: (code: string) => void;
	previewFile?: File | null;
	isRendering?: boolean;
	reset?: () => void;
	resetLog?: () => void;
}>({
	log: [],
});

type Props = {
	children: React.ReactNode;
};

// Create a provider component
export default function OpenscadWorkerProvider({ children }: Props) {
	const [log, setLog] = useState<string[]>([]);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [isRendering, setIsRendering] = useState<boolean>(false);

	const value = {
		log,
		previewFile,
		isExporting,
		isRendering,

		execExport: async (code: string) => {
			setIsExporting(true);

			const output = await executeOpenSCAD(WorkerMessageType.EXPORT, code);

			setLog((prevLog) => [
				...prevLog,
				...output.log.stdErr,
				...output.log.stdOut,
			]);

			setIsExporting(false);
			return output.output;
		},

		preview: async (code: string) => {
			setIsRendering(true);

			const output = await executeOpenSCAD(WorkerMessageType.PREVIEW, code);

			setLog((prevLog) => [
				...prevLog,
				...output.log.stdErr,
				...output.log.stdOut,
			]);

			if (output.output) {
				setPreviewFile(output.output);
			}
			setIsRendering(false);
		},

		reset: () => {
			setLog([]);
			setPreviewFile(null);
			setIsExporting(false);
			setIsRendering(false);
		},

		resetLog: () => {
			setLog([]);
		},
	};

	return (
		<OpenSCADWorkerContext.Provider value={value}>
			{children}
		</OpenSCADWorkerContext.Provider>
	);
}

export function useOpenSCADProvider() {
	return React.useContext(OpenSCADWorkerContext);
}
