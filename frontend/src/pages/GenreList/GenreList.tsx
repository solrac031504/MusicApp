import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './GenreList.module.css';

interface ListData {
    id: number;
    name: string;
};

interface ListDataResponse {
    data: ListData[];
    error?: string;
}

const GenreList: React.FC = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState<ListDataResponse>({ data: []});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const baseUrl = "http://localhost:5000";

    // Get the genres
    const getGenreList = async (): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await fetch(`${baseUrl}/api/list/genres`)
            const result = await response.json();

            console.log(result);

            // Empty genres to hold data
            const genres: ListData[] = [];

            // iterate through data and push into array
             result.data.forEach((row: any) => {
                const genre: ListData = {
                    id: row.GenreId,
                    name: row.GenreName
                };

                genres.push(genre);
             });

             const list: ListDataResponse = {
                data: genres
             }

            setGenres(list);  
        } catch (err) {
            console.error("Error fetching genres:", err);

            const errorMessage = err instanceof Error
                ? err.message
                : "Unknown error";

            const errorResponse: ListDataResponse = {
                data: [],
                error: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Use useEffect to call getGenreList only once on component mount
    useEffect(() => {
        getGenreList();
    }, []); // Empty dependency array means it runs only once

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <main className={styles.title}>
                <h1>Genres</h1>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.headerCell}>Genre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres!.data.map((genre) => (
                            <tr key={genre.id} className={styles.row}>
                                <td className={styles.cell}>
                                    <a 
                                        href={`/genre/${genre.id}`} 
                                        className={styles.genreLink}
                                    >
                                        {genre.name}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default GenreList;