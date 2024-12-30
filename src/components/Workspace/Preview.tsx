import { CircularProgress, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import type * as THREE from "three";
import { useOpenSCADProvider } from "../providers/OpenscadWorkerProvider";
import ThreeJsCanvas from "./Preview/ThreeJsCanvas";
import readFromSTLFile from "./Preview/readFromSTLFile";

export default function Preview() {
	const { previewFile, isRendering } = useOpenSCADProvider();
	const [geometry, setGeometry] = React.useState<THREE.Group | null>(null);
	const theme = useTheme();

	useEffect(() => {
		if (!previewFile) {
			return;
		}

		(async () => {
			const newGeometry = await readFromSTLFile(
				previewFile,
				theme.palette.primary.main,
			);

			setGeometry(newGeometry);
		})();
	}, [previewFile]);

	const loading = (
		<div
			style={{
				zIndex: 999,
				position: "absolute",
				height: "100%",
				width: "100%",
				backgroundColor: "rgba(255,255,255,0.5)",
			}}
		>
			<div
				style={{
					top: "50%",
					left: "50%",
					position: "absolute",
					transform: "translate(-50%,-50%)",
				}}
			>
				<CircularProgress />
			</div>
		</div>
	);

	if (!previewFile && isRendering) {
		return loading;
	}

	if (!previewFile) {
		return null;
	}

	return (
		<div style={{ height: "100%" }}>
			<ThreeJsCanvas geometry={geometry} />
		</div>
	);
}
