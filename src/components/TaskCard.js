import React from 'react';
import {
    Paper,
    Typography,
    Box,
    IconButton,
    Tooltip,
    useTheme,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High': return 'error.main';
        case 'Medium': return 'warning.main';
        case 'Low': return 'success.main';
        default: return 'text.primary';
    }
};

const TaskCard = ({ title, description, priority, dueDate, reminder, onDelete }) => {
    const theme = useTheme();
    const isOverdue = dueDate && new Date(dueDate) < new Date();

    return (
        <Paper
            elevation={4}
            tabIndex={0}
            sx={{
                p: 3,
                borderRadius: 4,
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                backdropFilter: 'blur(4px)', // optional glass effect
                boxShadow: theme.shadows[3],
                '&:hover': {
                    transform: 'translateY(-5px) scale(1.01)',
                    boxShadow: theme.shadows[8],
                    background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.grey[100]})`,
                },
                '&:focus': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: '2px',
                },
                width: '90%',
                maxWidth: 480,
                mx: 'auto',
            }}
        >
            {/* Delete Button */}
            <Tooltip title="Delete Task" arrow>
                <IconButton
                    size="small"
                    onClick={onDelete}
                    aria-label="delete task"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.contrastText,
                        transition: 'all 0.25s ease-in-out',
                        '&:hover': {
                            backgroundColor: theme.palette.error.main,
                            transform: 'scale(1.2)',
                        },
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Box display="flex" flexDirection="column" gap={1.5}>
                {/* Title */}
                <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        transition: 'color 0.3s, text-decoration 0.3s',
                        '&:hover': {
                            color: theme.palette.primary.main,
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                >
                    {title}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                    }}
                >
                    {description}
                </Typography>

                {/* Priority Badge */}
                <Box>
                    <Chip
                        label={`Priority: ${priority}`}
                        size="small"
                        sx={{
                            backgroundColor: theme.palette[getPriorityColor(priority).split('.')[0]].light,
                            color: theme.palette[getPriorityColor(priority).split('.')[0]].dark,
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.5,
                        }}
                    />
                </Box>

                {/* Due Date */}
                {dueDate && (
                    <Typography
                        variant="caption"
                        color={isOverdue ? 'error.main' : 'text.secondary'}
                        sx={{
                            fontStyle: isOverdue ? 'italic' : 'normal',
                            fontWeight: isOverdue ? 600 : 400,
                        }}
                    >
                        Due: {new Date(dueDate).toLocaleDateString()}
                    </Typography>
                )}

                {/* Reminder */}
                {reminder && (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                            icon={<AlarmIcon fontSize="small" />}
                            label={new Date(reminder).toLocaleString()}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{
                                px: 1,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default TaskCard;
