import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface GenreObject {
    name: string;
    description: string;
    hierarchy: string[];
    error?: string;
}

const Genre: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [genreName, setGenreName] = useState<string>('');
    const [genreDescription, setGenreDescription] = useState<string>('');
    const [genreHierarchy, setGenreHierarchy] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const baseUrl = "http://localhost:5000";

    const getGenre = async (genreId: number): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await fetch(`${baseUrl}/api/genre/?id=${genreId}`);

            const result = await response.json();

            const genre: GenreObject = {
                name: result.name,
                description: result.description,
                hierarchy: result.hierarchy
            }

            setGenreName(genre.name);
            setGenreDescription(genre.description);
            setGenreHierarchy(genre.hierarchy);
        } catch (err) {
            console.error("Error retrieving genre info:", err);

            const errorMessage = err instanceof Error
                ? err.message
                : "Unknown error";
        } finally {
            setIsLoading(false);
        }
    };

    // Get the genres
    useEffect(() => {
        let genreId: number = isNaN(Number(id))
            ? -1
            : parseInt(id!);

        getGenre(genreId);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="genre-container">
            <main className="container mt-4">
                <h1>{genreName}</h1>
                <p>Description: {genreDescription}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Hierarchy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genreHierarchy.map((result, index) => (
                            <tr key={index}>
                                <td>{result}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default Genre;