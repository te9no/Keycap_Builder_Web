import type {
	OpenSCADWorkerResponseData,
	WorkerMessage,
	WorkerMessageType,
} from "../../worker/types";
import WorkspaceFile from "../WorkspaceFile";
import executeWorkerJob from "../executeWorkerJob";

type Output = Omit<OpenSCADWorkerResponseData, "output"> & { output: File };

export default async function executeOpenSCAD(
	type: WorkerMessageType,
	code: string,
): Promise<Output> {
	const message: WorkerMessage = {
		type,
		data: {
			code,
		},
	};

	const response = await executeWorkerJob(message);
	const data = response.data as OpenSCADWorkerResponseData;
	let output: WorkspaceFile;

	if (data.output) {
		output = new WorkspaceFile([data.output], "output.stl");
	}

	return {
		...data,
		output,
	};
}
