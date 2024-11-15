import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Info from '../Info';

const Home = () => {
	const [loading, setLoading] = useState(true);
	const [movie, setMovie] = useState({});
	const [searchText, setSearchText] = useState('The Avenger');
	const [query, setQuery] = useState('The Avenger'); // Separate state for actual search
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMovie = async () => {
			setLoading(true);
			setError(null);

			const apiKey = '18fec770'; // Replace with environment variable if needed
			if (!apiKey) {
				setError('API key is missing. Please provide a valid API key.');
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(
					`http://www.omdbapi.com/?t=${query}&apikey=${apiKey}`
				);
				const data = await response.json();

				if (data.Response === 'False') {
					setError(data.Error);
				} else {
					setMovie(data);
				}
			} catch (error) {
				setError('Failed to fetch movie data. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		// Fetch movie data whenever `query` changes
		if (query.trim()) {
			fetchMovie();
		}
	}, [query]);

	// Debounce effect for searchText
	useEffect(() => {
		const timer = setTimeout(() => {
			setQuery(searchText); // Update `query` only after a delay
		}, 4000); // 500ms debounce delay

		return () => clearTimeout(timer); // Cleanup previous timer
	}, [searchText]);

	if (loading) {
		return (
			<section className="section loading">
				<h1>Loading...</h1>
			</section>
		);
	}

	return (
		<div>
			<Navbar />
			<div className="search-container">
				<form
					className="search-form"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<input
						type="text"
						className="search-field"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Search for your favorite movie here..."
					/>
				</form>
			</div>
			{error ? (
				<div className="content-container">
					<h4>{error}</h4>
				</div>
			) : (
				<Info movie={movie} />
			)}
			<Footer />
		</div>
	);
};

export default Home;
