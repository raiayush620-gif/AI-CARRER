import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Trash2, Save, User as UserIcon, LoaderCircle } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
    const { user, setUser } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');
        
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image format (JPG, PNG, WEBP).');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB.');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const { data } = await api.post('/users/profile-image', formData);
            setUser({ ...user, profileImage: data.profileImage });
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload profile image.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
        try {
            await api.delete('/users/profile-image');
            setUser({ ...user, profileImage: '' });
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err) {
            setError('Failed to remove profile image.');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto py-8 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold text-primary-theme mb-8">Profile Settings</h1>
            
            <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border border-gray-200 dark:border-dark-border p-8 rounded-3xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    
                    {/* Left: Profile Image Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group mb-4">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-dark-bg shadow-md" />
                            ) : user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-dark-bg shadow-md" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-dark-bg shadow-md">
                                    {getInitials(user?.name)}
                                </div>
                            )}
                            
                            {/* Overlay Edit Button (if no preview active) */}
                            {!previewUrl && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium gap-2"
                                >
                                    <Camera className="w-5 h-5" /> Edit
                                </button>
                            )}
                        </div>

                        <input 
                            type="file" 
                            accept="image/jpeg, image/png, image/webp"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {error && <div className="text-red-500 text-sm font-medium mb-4 text-center max-w-[200px]">{error}</div>}

                        {previewUrl ? (
                            <div className="flex flex-col gap-2 w-full">
                                <button 
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="w-full bg-brand-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-600 transition-colors flex justify-center items-center gap-2"
                                >
                                    {isUploading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isUploading ? 'Saving...' : 'Save Photo'}
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    disabled={isUploading}
                                    className="w-full bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 w-full">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Change Photo
                                </button>
                                {user?.profileImage && (
                                    <button 
                                        onClick={handleRemove}
                                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove Photo
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Profile Info */}
                    <div className="flex-1 space-y-6 w-full">
                        <div>
                            <label className="text-sm font-bold text-secondary-theme uppercase tracking-wider mb-1 block">Full Name</label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border px-4 py-3 rounded-xl">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <span className="text-primary-theme font-medium">{user?.name}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-secondary-theme uppercase tracking-wider mb-1 block">Email Address</label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border px-4 py-3 rounded-xl">
                                <span className="font-bold text-gray-400">@</span>
                                <span className="text-primary-theme font-medium">{user?.email}</span>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                            <p className="text-sm text-secondary-theme">
                                This is your public profile information. Currently, name and email cannot be changed.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
