import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import Layout from '../../../components/Layout';
import categories from '../../../utils/categories';

export default function ProductCreateScreen() {
    const router = useRouter();

    /* ---------- INFOS DE BASE ---------- */
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [description, setDescription] = useState('');

    /* ---------- COULEURS / TAILLES ---------- */
    const [colors, setColors] = useState([
        {
            name: '',
            images: [],
            sizes: [{ name: 'Unique', countInStock: 0 }],
        },
    ]);
    const [useMultipleSizes, setUseMultipleSizes] = useState(false);

    /* ---------- UPLOAD IMAGE ---------- */
    const uploadImageHandler = async (file, colorIndex) => {
        try {
            // Options de compression
            const options = {
                maxSizeMB: 1, // Taille max 1MB
                maxWidthOrHeight: 1920, // Dimension max
                useWebWorker: true,
                fileType: 'image/jpeg', // Convertir en JPEG pour meilleure compression
            };

            // Afficher un toast pendant la compression
            toast.info('Compression de l\'image en cours...');

            // Compresser l'image
            const compressedFile = await imageCompression(file, options);

            // Créer le FormData avec l'image compressée
            const formData = new FormData();
            formData.append('image', compressedFile);

            // Upload
            const { data } = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updated = [...colors];
            updated[colorIndex].images.push(data);
            setColors(updated);

            toast.success('Image ajoutée avec succès');
        } catch (err) {
            toast.error('Erreur lors de l\'upload de l\'image');
            console.error(err);
        }
    };

    /* ---------- SUBMIT ---------- */
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !price || colors.length === 0) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Générer le slug automatiquement à partir du nom avec un ID unique
        const baseSlug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
            .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
            .replace(/^-+|-+$/g, ''); // Enlever les tirets au début et à la fin

        // Ajouter un identifiant unique pour éviter les doublons
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const slug = `${baseSlug}-${uniqueId}`;

        try {
            const { data } = await axios.post('/api/admin/products/create', {
                name,
                slug,
                category,
                brand: 'aysha_accessoires', // Marque définie automatiquement
                price,
                discount: discount || 0,
                description,
                colors,
            });

            toast.success('Produit créé avec succès');
            router.push(`/admin/product/${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <Layout title="Créer un produit">
            <div className="min-h-screen bg-gray-50 py-4 md:py-10 px-2">
                <form
                    onSubmit={submitHandler}
                    className="mx-auto max-w-3xl rounded-xl bg-white p-4 md:p-8 shadow"
                >
                    <h1 className="mb-6 md:mb-8 text-xl md:text-2xl font-semibold">
                        Créer un nouveau produit
                    </h1>

                    {/* ---------- INFOS PRODUIT ---------- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="input"
                            placeholder="Nom du produit *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <select
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">— Choisir une catégorie —</option>
                            {categories.map((cat) => (
                                <option key={cat.key} value={cat.key}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <input
                            className="input"
                            type="number"
                            placeholder="Prix (DT) *"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <input
                            className="input"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Réduction en % (Ex: 20 pour -20%) - Optionnel"
                            value={discount}
                            onChange={(e) => {
                                const val = e.target.value === '' ? '' : Math.min(100, Math.max(0, e.target.value));
                                setDiscount(val);
                            }}
                        />
                    </div>

                    <textarea
                        className="input mt-4"
                        rows={4}
                        placeholder="Description du produit"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* ---------- COULEURS ---------- */}
                    <div className="mt-8">
                        <h2 className="mb-4 text-lg font-semibold">
                            Couleurs, tailles et stock
                        </h2>

                        {colors.map((color, colorIndex) => (
                            <div
                                key={colorIndex}
                                className="mb-6 rounded-xl border p-3 md:p-4"
                            >
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                                    {/* COLOR PICKER */}
                                    <input
                                        type="color"
                                        value={color.name || '#000000'}
                                        onChange={(e) => {
                                            const updated = [...colors];
                                            updated[colorIndex].name = e.target.value; // on stocke le HEX ici
                                            setColors(updated);
                                        }}
                                        className="h-12 w-16 cursor-pointer border-none bg-transparent"
                                    />

                                    {/* PREVIEW */}
                                    <div
                                        className="h-10 w-10 rounded-full border shadow"
                                        style={{ backgroundColor: color.name }}
                                    />

                                    <span className="text-xs md:text-sm text-gray-600">
                                        {color.name}
                                    </span>
                                </div>

                                {/* IMAGES */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            uploadImageHandler(e.target.files[0], colorIndex);
                                        }
                                    }}
                                    className="mb-3 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 truncate"
                                />

                                <div className="flex gap-2 mb-4 flex-wrap">
                                    {color.images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <Image
                                                src={img}
                                                alt="preview"
                                                width={80}
                                                height={80}
                                                className="rounded-lg object-cover border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...colors];
                                                    updated[colorIndex].images = updated[colorIndex].images.filter((_, idx) => idx !== i);
                                                    setColors(updated);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* TAILLES - MODE SIMPLIFIÉ */}
                                {!useMultipleSizes ? (
                                    <div className="bg-[#FAF7F2] rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm font-medium text-[#2D2416]">
                                                Quantité en stock (Taille unique)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setUseMultipleSizes(true)}
                                                className="text-xs text-[#6B5635] underline hover:text-[#3D3021]"
                                            >
                                                + Ajouter plusieurs tailles
                                            </button>
                                        </div>
                                        <input
                                            className="input w-full"
                                            type="number"
                                            min="0"
                                            placeholder="Quantité disponible"
                                            value={color.sizes[0]?.countInStock === 0 ? '' : color.sizes[0]?.countInStock}
                                            onChange={(e) => {
                                                const updated = [...colors];
                                                if (!updated[colorIndex].sizes[0]) {
                                                    updated[colorIndex].sizes[0] = { name: 'Unique', countInStock: 0 };
                                                }
                                                updated[colorIndex].sizes[0].countInStock =
                                                    e.target.value === '' ? 0 : Number(e.target.value);
                                                updated[colorIndex].sizes[0].name = 'Unique';
                                                setColors(updated);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    /* TAILLES - MODE AVANCÉ */
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-[#2D2416]">
                                                Tailles et stock
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...colors];
                                                    updated[colorIndex].sizes = [{ name: 'Unique', countInStock: 0 }];
                                                    setColors(updated);
                                                    setUseMultipleSizes(false);
                                                }}
                                                className="text-xs text-red-500 underline"
                                            >
                                                Revenir à taille unique
                                            </button>
                                        </div>
                                        {color.sizes.map((size, sizeIndex) => (
                                            <div
                                                key={sizeIndex}
                                                className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-[#FAF7F2] p-3 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Taille / Pointure
                                                    </label>
                                                    <input
                                                        className="input w-full"
                                                        placeholder="ex : S, M, 38, 40"
                                                        value={size.name}
                                                        onChange={(e) => {
                                                            const updated = [...colors];
                                                            updated[colorIndex].sizes[sizeIndex].name =
                                                                e.target.value;
                                                            setColors(updated);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex gap-2 items-end">
                                                    <div className="flex-1 sm:w-32">
                                                        <label className="block text-xs text-gray-500 mb-1">
                                                            Quantité en stock
                                                        </label>
                                                        <input
                                                            className="input w-full"
                                                            type="number"
                                                            min="0"
                                                            placeholder="0"
                                                            value={size.countInStock === 0 ? '' : size.countInStock}
                                                            onChange={(e) => {
                                                                const updated = [...colors];
                                                                updated[colorIndex].sizes[sizeIndex].countInStock =
                                                                    e.target.value === '' ? 0 : Number(e.target.value);
                                                                setColors(updated);
                                                            }}
                                                        />
                                                    </div>
                                                    {color.sizes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
                                                            onClick={() => {
                                                                const updated = [...colors];
                                                                updated[colorIndex].sizes = updated[
                                                                    colorIndex
                                                                ].sizes.filter((_, i) => i !== sizeIndex);
                                                                setColors(updated);
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="text-sm text-[#6B5635] underline hover:text-[#3D3021]"
                                            onClick={() => {
                                                const updated = [...colors];
                                                updated[colorIndex].sizes.push({
                                                    name: '',
                                                    countInStock: 0,
                                                });
                                                setColors(updated);
                                            }}
                                        >
                                            + Ajouter une taille
                                        </button>
                                    </div>
                                )}

                                {colors.length > 1 && (
                                    <button
                                        type="button"
                                        className="mt-4 block text-xs md:text-sm text-red-500 underline"
                                        onClick={() =>
                                            setColors(colors.filter((_, i) => i !== colorIndex))
                                        }
                                    >
                                        Supprimer cette couleur
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                setColors([
                                    ...colors,
                                    {
                                        name: '',
                                        images: [],
                                        sizes: [{ name: 'Unique', countInStock: 0 }],
                                    },
                                ])
                            }
                            className="w-full sm:w-auto default-button"
                        >
                            + Ajouter une couleur
                        </button>
                    </div>

                    <button className="mt-6 md:mt-10 w-full rounded-lg bg-black py-3 text-sm md:text-base font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]">
                        Créer le produit
                    </button>

                </form>
            </div>
        </Layout>
    );
}

ProductCreateScreen.auth = { adminOnly: true };
