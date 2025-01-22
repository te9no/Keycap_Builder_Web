import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import JSZip from "jszip";
import React, { useCallback, useState } from "react";
import { Fragment } from "react";
import type { Field } from "./Workspace";
import { useOpenSCADProvider } from "./providers/OpenscadWorkerProvider";

type Props = {
	fields: Field[];
	setFields: (fields: Field[]) => void;
};

const escapeString = (str: string) => {
	return str
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/'/g, "\\'")
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t");
};

const makeFilenameSafe = (name: string) => {
	return name
		.replace(/\//g, "slash")
		.replace(/\\/g, "backslash")
		.replace(/:/g, "colon")
		.replace(/\*/g, "asterisk")
		.replace(/\?/g, "question")
		.replace(/"/g, "quote")
		.replace(/</g, "less")
		.replace(/>/g, "greater")
		.replace(/\|/g, "pipe");
};

let keycap = "";

export default function Buttons({ fields, setFields }: Props) {
	const { execExport, isExporting } = useOpenSCADProvider();
	const [loadingState, setLoadingState] = useState({
		loading: false,
		exportedFile: 0,
	});

	const downloadFile = useCallback((filename: string, obj: File | Blob) => {
		const url = URL.createObjectURL(obj);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
	}, []);

	const handleDownload = useCallback(() => {
		const json = JSON.stringify(fields);
		const blob = new Blob([json], { type: "application/json" });
		downloadFile("keycap-builder.json", blob);
	}, [fields, downloadFile]);

	const handleUpload = useCallback(() => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";
		input.onchange = () => {
			const file = input.files?.item(0);
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					const json = reader.result as string;
					const data = JSON.parse(json);
					const newFields = data.map((field: Field) => ({
						...field,
					}));
					setFields(newFields);
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}, [setFields]);

	const exportKeycap = async () => {
		if (!keycap) {
			const response = await fetch("Keycap.scad", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to export keycap:", response.statusText);
				return;
			}

			keycap = await response.text();
		}
		const exportedFiles: { file: File; name: string }[] = [];
		setLoadingState({ loading: true, exportedFile: 0 });

		for (let index = 0; index < fields.length; index++) {
			const field = fields[index];

			const importModelPath = ["Cap_U.stl", "Cap_O.stl", "Cap_Flat.stl"][
				field.model
			];
			const replacements = {
				LLB: field.type === 0 ? escapeString(field.main) : "",
				LLT: field.type === 0 ? escapeString(field.shift) : "",
				LRT: field.type === 0 ? escapeString(field.fn) : "",
				LC: field.type === 1 ? escapeString(field.center) : "",
				MODEL_PATH: importModelPath,
				CENTER_ROTATION: field.angle.toString(),
				NEED_BUMP: field.needBump.toString(),
			};

			let customKeycap = keycap;
			for (const [key, value] of Object.entries(replacements)) {
				const regex = new RegExp(key, "g");
				customKeycap = customKeycap.replace(regex, value);
			}

			const safeLLB = makeFilenameSafe(field.main);
			const safeLLT = makeFilenameSafe(field.shift);
			const safeLRB = makeFilenameSafe(field.fn);
			const safeLC = makeFilenameSafe(field.center);
			const modelType = ["U", "O", "F"][field.model];
			const needBump = field.needBump ? "Bump" : "";
			const filename =
				field.type === 0
					? `Keycap_${safeLLB}_${safeLLT}_${safeLRB}_${needBump}_${modelType}.stl`
					: `Keycap_${safeLC}_${field.angle}_${needBump}_${modelType}.stl`;

			const stlFile = await execExport(customKeycap);
			exportedFiles.push({ file: stlFile, name: filename });
			setLoadingState({ loading: true, exportedFile: index + 1 });
		}

		if (exportedFiles.length === 1) {
			const file = exportedFiles[0];
			downloadFile(file.name, file.file);
		} else {
			const zip = new JSZip();
			for (const { name, file } of exportedFiles) {
				zip.file(name, file);
			}

			const zipBlob = await zip.generateAsync({ type: "blob" });
			downloadFile("keycaps.zip", zipBlob);
		}

		setLoadingState({ loading: false, exportedFile: 0 });
	};

	return (
		<Fragment>
			<Button
				variant="outlined"
				disabled={isExporting}
				endIcon={<AutoAwesomeIcon />}
				onClick={exportKeycap}
				sx={{
					borderColor: "#fff",
					color: "#fff",
					"&:hover": {
						borderColor: "#ccc",
						color: "#ccc",
					},
				}}
			>
				Export Keycap
			</Button>
			<Button
				variant="outlined"
				disabled={isExporting}
				endIcon={<DownloadIcon />}
				onClick={handleDownload}
				sx={{
					borderColor: "#fff",
					color: "#fff",
					"&:hover": {
						borderColor: "#ccc",
						color: "#ccc",
					},
				}}
			>
				Download Layout
			</Button>
			<Button
				variant="outlined"
				disabled={isExporting}
				endIcon={<UploadIcon />}
				onClick={handleUpload}
				sx={{
					borderColor: "#fff",
					color: "#fff",
					"&:hover": {
						borderColor: "#ccc",
						color: "#ccc",
					},
				}}
			>
				Upload Layout
			</Button>
			{loadingState.loading && (
				<Box
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1300,
					}}
				>
					<Box
						sx={{
							position: "relative",
							display: "inline-flex",
							backgroundColor: "white",
							borderRadius: "50%",
							padding: 2,
						}}
					>
						<CircularProgress
							variant="determinate"
							size={120}
							value={(loadingState.exportedFile / fields.length) * 100}
						/>
						<Box
							sx={{
								top: 0,
								left: 0,
								bottom: 0,
								right: 0,
								position: "absolute",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Typography
								variant="caption"
								component="div"
								sx={{ color: "black", fontSize: 20 }}
							>{`${Math.round((loadingState.exportedFile / fields.length) * 100)}%`}</Typography>
						</Box>
					</Box>
				</Box>
			)}
		</Fragment>
	);
}
