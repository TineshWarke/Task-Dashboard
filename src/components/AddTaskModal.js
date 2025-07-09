import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Stack,
} from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const initialState = {
    title: '',
    description: '',
    stage: 'To Do',
    priority: 'Medium',
    dueDate: '',
    reminder: '',
};

const stages = ['To Do', 'In Progress', 'Done'];
const priorities = ['High', 'Medium', 'Low'];

const AddTaskModal = ({ open, onClose, onAdd }) => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setForm(initialState);
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const now = new Date();
        const temp = {};

        temp.title = form.title ? '' : 'Title is required';
        temp.description = form.description ? '' : 'Description is required';

        if (form.dueDate && new Date(form.dueDate) < new Date(now.toDateString())) {
            temp.dueDate = 'Due date cannot be in the past';
        }

        if (form.reminder && new Date(form.reminder) < now) {
            temp.reminder = 'Reminder must be in the future';
        }

        return temp;
    };

    const handleSubmit = () => {
        const tempErrors = validate();
        setErrors(tempErrors);

        if (Object.values(tempErrors).some((err) => err)) return;

        const newTask = {
            ...form,
            id: Date.now(),
        };

        onAdd(newTask);
        setForm(initialState);
        onClose();
    };

    const handleClose = () => {
        setForm(initialState);
        setErrors({});
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="add-task-modal">
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2} id="add-task-modal">
                    Add New Task
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        autoFocus
                        value={form.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    <TextField
                        select
                        label="Stage"
                        name="stage"
                        fullWidth
                        value={form.stage}
                        onChange={handleChange}
                    >
                        {stages.map((stage) => (
                            <MenuItem key={stage} value={stage}>
                                {stage}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Priority"
                        name="priority"
                        fullWidth
                        value={form.priority}
                        onChange={handleChange}
                    >
                        {priorities.map((priority) => (
                            <MenuItem key={priority} value={priority}>
                                {priority}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={form.dueDate}
                        onChange={handleChange}
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                    />

                    <TextField
                        label="Reminder"
                        name="reminder"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={form.reminder}
                        onChange={handleChange}
                        error={!!errors.reminder}
                        helperText={errors.reminder}
                    />

                    <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={handleClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained">
                            Add Task
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
