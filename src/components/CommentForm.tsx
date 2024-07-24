import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box } from '@mui/material';


const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phone: yup.string().matches(/^[0-9]+$/, 'Please enter number only').required('Phone is required'),
    comment: yup.string().required('Comment is required'),
});

const CommentForm: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <Container>
            <Typography variant="h6">Submit your comment</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Name"
                            error={!!errors.name}
                            helperText={errors.name ? errors.name.message : ''}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ''}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Phone"
                            error={!!errors.phone}
                            helperText={errors.phone ? errors.phone.message : ''}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="comment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Comment"
                            multiline
                            rows={4}
                            error={!!errors.comment}
                            helperText={errors.comment ? errors.comment.message : ''}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default CommentForm;
