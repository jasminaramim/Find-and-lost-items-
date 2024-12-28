import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/Authprovider';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateItemPage = () => {
    const { id } = useParams(); 
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();

    const [item, setItem] = useState({
        title: '',
        description: '',
        postType: '',
        location: '',
        contactInfo: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/items/${id}`);
                if (response.status === 200) {
                    setItem(response.data);
                } else {
                    Swal.fire('Error', 'Failed to fetch item details.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'An error occurred while fetching item details.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItemDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/items/${id}`,
                item, 
                { headers: { 'Content-Type': 'application/json' } } 
            );
    
            if (response.status === 200) {
                Swal.fire('Success', 'Item updated successfully!', 'success');
                navigate('/'); 
            } else {
                Swal.fire('Error', response.data.message || 'Failed to update item.', 'error');
            }
        } catch (error) {
            console.error('Error updating item:', error); // Debugging AxiosError
            Swal.fire('Error', 'An error occurred while updating the item.', 'error');
        }
    };
    
    

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-5">
            <h2 className="text-2xl font-semibold mb-5">Update Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={item.title}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={item.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="postType" className="block text-sm font-medium text-gray-700">
                        Post Type
                    </label>
                    <input
                        type="text"
                        id="postType"
                        name="postType"
                        value={item.postType}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={item.location}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                        User Email
                    </label>
                    <input
                        type="email"
                        id="userEmail"
                        value={user?.email || ''}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        readOnly
                    />
                </div>

                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                        User Name
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={user?.displayName || ''}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded-md"
                >
                    Update Item
                </button>
            </form>
        </div>
    );
};

export default UpdateItemPage;
