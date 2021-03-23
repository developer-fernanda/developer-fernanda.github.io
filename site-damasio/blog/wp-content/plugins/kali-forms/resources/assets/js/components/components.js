// import React, { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';

// Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import GridOffIcon from '@material-ui/icons/GridOff';
import GridOnIcon from '@material-ui/icons/GridOn';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/Inbox';
import TransformIcon from '@material-ui/icons/Transform';
import SettingsIcon from '@material-ui/icons/Settings';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CodeIcon from '@material-ui/icons/Code';
import MoveVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add';

// Layout
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Snackbar from '@material-ui/core/Snackbar';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';

// Forms
// import InputAdornment from '@material-ui/core/InputAdornment';
// import InputBase from '@material-ui/core/InputBase';
// import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';
// import Switch from '@material-ui/core/Switch';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormLabel from '@material-ui/core/InputLabel';
// import FormGroup from '@material-ui/core/FormGroup';
// import RichTextEditor from 'react-rte';
// import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';

// Tables
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// Buttons
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';

// Misc
// import Divider from '@material-ui/core/Divider';
// import Tooltip from '@material-ui/core/Tooltip';
// import Typography from '@material-ui/core/Typography';
// import Tab from '@material-ui/core/Tab';
// import Tabs from '@material-ui/core/Tabs';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Badge from '@material-ui/core/Badge';
// import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
// import LinearProgress from '@material-ui/core/LinearProgress';

const misc = {
	// Divider,
	// Tooltip,
	// Typography,
	// Tab,
	// Tabs,
	// ExpansionPanel,
	// ExpansionPanelSummary,
	// ExpansionPanelDetails,
	// ExpansionPanelActions,
	// List,
	// ListItem,
	// ListItemIcon,
	// ListItemText,
	// Badge,
	// Card, CardHeader,
	// LinearProgress
}

const forms = {
	// InputAdornment,
	// InputBase,
	// TextField,
	// MenuItem,
	// Switch,
	// FormControlLabel,
	// FormLabel,
	// FormGroup,
	// RichTextEditor,
	// DatePicker, MuiPickersUtilsProvider, TimePicker
}

const tables = {
	// Table,
	// TableBody,
	// TableCell,
	// TableHead,
	// TableRow,
}

const buttons = {
	// Button,
	// IconButton
}

const icons = {
	// ArrowBackIcon,
	// CloseIcon,
	// EditIcon,
	// SaveIcon,
	// GridOffIcon,
	// GridOnIcon,
	// PlusIcon,
	// DeleteIcon,
	// ExpandMoreIcon,
	// InboxIcon,
	// TransformIcon,
	// SettingsIcon,
	// VpnKeyIcon,
	// CodeIcon,
	// MoveVertIcon,
	// AddIcon
}

const layout = {
	// AppBar,
	// Toolbar,
	// Snackbar,
	// Grid,
	// Paper
}

const mergeComponents = () => {
	let existing = window.KaliComponents;
	let current = getComponents();

	let merged = {}

	for (let key in current) {
		merged[key] = { ...current[key], ...existing[key] }
	}

	return merged
}
const getComponents = () => {
	return {
		// layout,
		// misc,
		// forms,
		// tables,
		// icons,
		// buttons,
		// React,
		// ReactDOM,
		// useEffect,
		// useState
	}
}

window.KaliComponents = window.hasOwnProperty('KaliComponents')
	? mergeComponents()
	: getComponents();

console.log(window.KaliComponents);
