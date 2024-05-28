import React, { useEffect, useState } from 'react';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.mensaje || 'Error al obtener los posts');
                }
            } catch (error) {
                setError('Error: ' + error.message);
            }
        };

        fetchPosts();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Posts</h2>
            <pre>{JSON.stringify(posts, null, 2)}</pre>
        </div>
    );
};

export default Posts;
