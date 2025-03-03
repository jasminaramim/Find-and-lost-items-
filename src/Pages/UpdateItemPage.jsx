import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/Authprovider';
import Swal from 'sweetalert2';
import useAxiosSecure from '../Hooks/useAxiosSecure'; 

const UpdateItemPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [item, setItem] = useState({
        itemName: '',
        description: '',
        category: '',
        location: '',
        contactInfo: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    const axiosSecure = useAxiosSecure();  // Initialize axiosSecure

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axiosSecure.get(`/items/${id}`);  // Use axiosSecure to make the request
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
    }, [id, axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!item.itemName || !item.description || !item.category || !item.location) {
            return Swal.fire('Error', 'All fields are required.', 'error');
        }

        try {
            const response = await axiosSecure.patch(  // Use axiosSecure for the PATCH request
                `/updateItem/${id}`,
                item,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                Swal.fire('Success', 'Item updated successfully!', 'success');
                navigate('/manage-my-items');
            } else {
                Swal.fire('Error', response.data.message || 'Failed to update item.', 'error');
            }
        } catch (error) {
            console.error('Error updating item:', error.response?.data || error.message);
            Swal.fire('Error', 'An error occurred while updating the item.', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-5">
            <h2 className="text-2xl font-semibold mb-5 text-red-500">Update Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-red-500">
                        Title
                    </label>
                    <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        value={item.itemName}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-red-500 rounded-md text-red-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-red-500">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={item.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-red-500 rounded-md text-red-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-red-500">
                        Post Type
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={item.category}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-red-500 rounded-md text-red-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-red-500">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={item.location}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-red-500 rounded-md text-red-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-red-500">
                        User Email
                    </label>
                    <input
                        type="email"
                        id="userEmail"
                        value={user?.email || ''}
                        className="mt-1 p-2 w-full border border-red-500 rounded-md text-red-500"
                        readOnly
                    />
                </div>

                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-red-500">
                        User Name
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={user?.displayName || ''}
                        className="mt-1 p-2 w-full border border-red-500 rounded-md text-red-500"
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-red-500 text-white p-2 rounded-md"
                >
                    Update Item
                </button>
            </form>
        </div>
    );
};

export default UpdateItemPage;
