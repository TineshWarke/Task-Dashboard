import {
    Box,
    Typography,
    Paper,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    useMediaQuery,
    useTheme,
    Stack,
    Fade,
} from '@mui/material';
import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
];

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [dueDateFilter, setDueDateFilter] = useState('All');

    const [tasks, setTasks] = useState(() => {
        const stored = localStorage.getItem('task-board');
        const parsed = stored ? JSON.parse(stored) : {};
        return {
            todo: parsed.todo || [],
            inprogress: parsed.inprogress || [],
            done: parsed.done || [],
        };
    });

    useEffect(() => {
        localStorage.setItem('task-board', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const now = Date.now();
        Object.values(tasks).flat().forEach((task) => {
            if (task.reminder) {
                const delay = new Date(task.reminder).getTime() - now;
                if (delay > 0) {
                    setTimeout(() => {
                        alert(`⏰ Reminder: "${task.title}" is due soon!`);
                    }, delay);
                }
            }
        });
    }, []);

    const handleAddTask = (newTask) => {
        const stage = newTask.stage.toLowerCase().replace(' ', '');
        setTasks((prev) => ({
            ...prev,
            [stage]: [...prev[stage], { ...newTask, category: newTask.category || 'General' }],
        }));
    };

    const handleDeleteTask = (columnId, taskId) => {
        const updated = tasks[columnId].filter((task) => task.id !== taskId);
        setTasks((prev) => ({ ...prev, [columnId]: updated }));
    };

    const handleDragEnd = ({ source, destination }) => {
        if (!destination) return;
        const sourceList = [...tasks[source.droppableId]];
        const destList = [...tasks[destination.droppableId]];
        const [moved] = sourceList.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceList.splice(destination.index, 0, moved);
            setTasks((prev) => ({ ...prev, [source.droppableId]: sourceList }));
        } else {
            destList.splice(destination.index, 0, moved);
            setTasks((prev) => ({
                ...prev,
                [source.droppableId]: sourceList,
                [destination.droppableId]: destList,
            }));
        }
    };

    const getFilteredTasks = (columnId) => {
        let filtered = tasks[columnId];
        if (priorityFilter !== 'All') {
            filtered = filtered.filter((task) => task.priority === priorityFilter);
        }

        if (dueDateFilter !== 'All') {
            const now = new Date();
            filtered = filtered.filter((task) => {
                const taskDate = new Date(task.dueDate);
                if (dueDateFilter === 'Today') {
                    return taskDate.toDateString() === now.toDateString();
                } else if (dueDateFilter === 'This Week') {
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return taskDate >= startOfWeek && taskDate <= endOfWeek;
                }
                return true;
            });
        }

        return filtered;
    };

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'flex-start' : 'center'}
                flexWrap="wrap"
                gap={2}
                mb={4}
            >
                <Typography variant="h4" fontWeight="bold" color="primary">
                    📋 Task Dashboard
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                >
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            value={priorityFilter}
                            label="Priority"
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel id="duedate-label">Due Date</InputLabel>
                        <Select
                            labelId="duedate-label"
                            value={dueDateFilter}
                            label="Due Date"
                            onChange={(e) => setDueDateFilter(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Today">Today</MenuItem>
                            <MenuItem value="This Week">This Week</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            setPriorityFilter('All');
                            setDueDateFilter('All');
                        }}
                        sx={{
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'grey.100',
                            },
                        }}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setOpen(true)}
                        sx={{
                            textTransform: 'none',
                            boxShadow: 2,
                            '&:hover': {
                                boxShadow: 4,
                            },
                        }}
                    >
                        ➕ Add Task
                    </Button>
                </Stack>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={3}
                    justifyContent={isMobile ? 'center' : 'space-between'}
                >
                    {columns.map(({ id, title }) => (
                        <Droppable droppableId={id} key={id}>
                            {(provided) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    elevation={4}
                                    sx={{
                                        flex: '1 1 30%',
                                        minWidth: 300,
                                        minHeight: '70vh',
                                        p: 2,
                                        bgcolor: '#fefefe',
                                        borderRadius: 3,
                                        transition: '0.3s',
                                        '&:hover': {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={600} color="text.secondary" mb={2}>
                                        {title}
                                    </Typography>
                                    {getFilteredTasks(id).map((task, index) => (
                                        <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                            {(provided) => (
                                                <Fade in timeout={500}>
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        mb={2}
                                                    >
                                                        <TaskCard
                                                            title={task.title}
                                                            description={task.description}
                                                            priority={task.priority}
                                                            dueDate={task.dueDate}
                                                            category={task.category}
                                                            onDelete={() => handleDeleteTask(id, task.id)}
                                                        />
                                                    </Box>
                                                </Fade>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Paper>
                            )}
                        </Droppable>
                    ))}
                </Box>
            </DragDropContext>

            <AddTaskModal open={open} onClose={() => setOpen(false)} onAdd={handleAddTask} />
        </Box>
    );
};

export default Dashboard;
