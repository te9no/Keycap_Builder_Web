import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
	AppBar,
	Box,
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import Ansi from "../presets/ansi.json";
import Nescius66 from "../presets/nescius66.json";
import Buttons from "./Buttons";

export type Field = {
	main: string;
	shift: string;
	fn: string;
	center: string;
	type: number;
	angle: number;
	model: number;
};

const presets = [Ansi, Nescius66];
const toolbarHeight = 64;
const FIELD_WIDTH = 120; // 横幅を定数で指定

export default function Workspace() {
	const [fields, setFields] = useState<Field[]>([
		{ main: "", shift: "", fn: "", center: "", rotation: 0, type: 0, model: 0 },
	]);

	const handleAddField = () => {
		setFields([
			...fields,
			{
				main: "",
				shift: "",
				fn: "",
				center: "",
				angle: 0,
				type: 0,
				model: 0,
			},
		]);
	};

	const handleRemoveField = (index: number) => {
		const newFields = fields.filter((_, i) => i !== index);
		if (newFields.length === 0) {
			setFields([
				{
					main: "",
					shift: "",
					fn: "",
					center: "",
					angle: 0,
					type: 0,
					model: 0,
				},
			]);
		} else {
			setFields(newFields);
		}
	};

	const [preset, setPreset] = useState(0);

	useEffect(() => {
		// デフォルトでANSIレイアウトを読み込む
		loadPreset(0);
	}, []);

	const loadPreset = (preset: number) => {
		if (preset < 0 && preset < presets.length) return;

		const newFields = presets[preset].map((field: Field) => ({
			...field,
		}));
		setFields(newFields);
	};

	const handlePresetChange = (event: SelectChangeEvent<number>) => {
		const newPreset = event.target.value as number;
		setPreset(newPreset);
		loadPreset(newPreset);
	};

	return (
		<Fragment>
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme: { zIndex: { drawer: number } }) =>
						theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar sx={{ gap: 2 }}>
					<Stack alignItems="center" direction="row" gap={1}>
						<Typography variant="body1">Keycap Builder for Web</Typography>
						<KeyboardIcon />
					</Stack>
					<Stack direction="row" alignItems="center" gap={2}>
						<FormControl size="small">
							<InputLabel
								id="select-filter-by-field-label"
								style={{ color: "white" }}
							>
								Preset
							</InputLabel>
							<Select
								sx={{
									color: "white",
									".MuiOutlinedInput-notchedOutline": {
										borderColor: "rgba(228, 219, 233, 0.25)",
									},
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
										borderColor: "rgba(228, 219, 233, 0.25)",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "rgba(228, 219, 233, 0.25)",
									},
									".MuiSvgIcon-root ": {
										fill: "white !important",
									},
								}}
								labelId="select-filter-by-field-label"
								id="select-filter-by-field"
								value={preset}
								onChange={handlePresetChange}
							>
								<MenuItem value={0}>ANSI</MenuItem>
								<MenuItem value={1}>Nescius66</MenuItem>
							</Select>
						</FormControl>
						<Tooltip title="Please give me a star!" arrow>
							<Button
								variant="text"
								color="inherit"
								sx={{ p: 0 }}
								href="https://github.com/ruchi12377/keycap_builder_web"
								target="_blank"
								rel="noopener noreferrer"
								size="large"
								startIcon={<GitHubIcon fontSize="large" />}
							>
								GitHub
							</Button>
						</Tooltip>
						<Tooltip
							title="If you have any questions, please contact me on Twitter!"
							arrow
						>
							<Button
								variant="text"
								color="inherit"
								sx={{ p: 0 }}
								href="https://twitter.com/ruchi12377"
								target="_blank"
								rel="noopener noreferrer"
								size="large"
								startIcon={<TwitterIcon fontSize="large" />}
							>
								Twitter
							</Button>
						</Tooltip>
					</Stack>
					<Box component="div" sx={{ flexGrow: 1 }} />
					<Buttons fields={fields} setFields={setFields} />
				</Toolbar>
			</AppBar>
			<Box component="main" sx={{ flexGrow: 1, pt: 0 }}>
				<Toolbar />
				<Box
					component="div"
					sx={{
						width: "100vw",
						height: `calc(100vh - ${toolbarHeight}px)`,
						overflow: "auto",
					}}
				>
					<Box
						sx={{
							padding: "20px",
							display: "flex",
							overflow: "scroll",
							gap: 1,
						}}
					>
						<Box sx={{ flex: 1 }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>Main</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>
									Shift
								</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>Fn</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>
									Center
								</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>
									Center Angle
								</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>
									Label Type
								</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>
									Model Type
								</Typography>
								<Typography sx={{ mr: 2, width: FIELD_WIDTH }}>
									<IconButton color="primary" onClick={handleAddField}>
										<AddIcon fontSize="large" />
									</IconButton>
								</Typography>
							</Box>
							{fields.map((field, rowIndex) => (
								<Box
									key={rowIndex}
									sx={{ display: "flex", alignItems: "center", mb: 2 }}
								>
									<TextField
										value={field.main}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].main = e.target.value;
											setFields(newFields);
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
										disabled={field.type === 1}
									/>
									<TextField
										value={field.shift}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].shift = e.target.value;
											setFields(newFields);
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
										disabled={field.type === 1}
									/>
									<TextField
										value={field.fn}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].fn = e.target.value;
											setFields(newFields);
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
										disabled={field.type === 1}
									/>
									<TextField
										value={field.center}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].center = e.target.value;
											setFields(newFields);
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
										disabled={field.type === 0}
									/>
									<TextField
										value={field.angle}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].angle = Number.parseInt(
												e.target.value,
											);
											setFields(newFields);
										}}
										inputProps={{
											inputMode: "numeric",
											pattern: "[0-9]*",
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
										disabled={field.type === 0}
									/>
									<TextField
										select
										value={field.type}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].type = Number.parseInt(
												e.target.value,
												10,
											);
											setFields(newFields);
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
									>
										<MenuItem value={0}>General</MenuItem>
										<MenuItem value={1}>Center</MenuItem>
									</TextField>
									<TextField
										select
										value={field.model}
										onChange={(e) => {
											const newFields = [...fields];
											newFields[rowIndex].model = Number.parseInt(
												e.target.value,
												10,
											);
											setFields(newFields);
										}}
										sx={{ mr: 2, width: FIELD_WIDTH }}
									>
										<MenuItem value={0}>Normal</MenuItem>
										<MenuItem value={1}>With Knot</MenuItem>
										<MenuItem value={2}>Flat</MenuItem>
									</TextField>
									<IconButton
										color="secondary"
										onClick={() => handleRemoveField(rowIndex)}
									>
										<DeleteIcon fontSize="large" />
									</IconButton>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Box>
			<Box
				component="footer"
				sx={{
					py: 2,
					px: 4,
					mt: "auto",
					backgroundColor: (theme) =>
						theme.palette.mode === "light"
							? theme.palette.grey[200]
							: theme.palette.grey[800],
					textAlign: "center",
				}}
			>
				<Typography variant="body2" color="text.secondary">
					&copy; 2024 - {new Date().getFullYear()} Ruchi12377. All rights
					reserved.
				</Typography>
			</Box>
		</Fragment>
	);
}
