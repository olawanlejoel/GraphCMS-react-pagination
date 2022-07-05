import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';

import Paginate from './Paginate';

const App = () => {
	const [blogPosts, setBlogPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPosts, setTotalPosts] = useState();
	const [postsPerPage] = useState(3);

	useEffect(() => {
		const fetchBlogPosts = async () => {
			const { posts, postsConnection } = await request(
				'https://api-us-east-1.graphcms.com/v2/cl3zo5a7h1jq701xv8mfyffi4/master',
				`
			{ 
				posts (first: ${postsPerPage}, skip: ${
					currentPage * postsPerPage - postsPerPage
				}) {
					id
					title
					excert
					postUrl
					cover {
					  url
					}
					datePublished
					author {
					  firstName
					  profilePicture {
						 url
					  }
					}
				 }
				 postsConnection {
					pageInfo {
					  pageSize
					}
				 }
			}
		 `
			);

			setBlogPosts(posts);
			setTotalPosts(postsConnection.pageInfo.pageSize);
		};

		fetchBlogPosts();
	}, [currentPage, postsPerPage]);

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const previousPage = () => {
		if (currentPage !== 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const nextPage = () => {
		if (currentPage !== Math.ceil(totalPosts / postsPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className="container">
			<div className="title">
				<h1>Blog</h1>
			</div>
			{blogPosts ? (
				<div className="blog-content-section">
					<div className="blog-container">
						{blogPosts.map((blogPost) => (
							<div className="blog-post" key={blogPost.id}>
								<img className="cover-img" src={blogPost.cover.url} alt="" />
								<h2 className="title">{blogPost.title}</h2>

								<p className="description">{blogPost.excert}</p>
								<div className="card-details">
									<div className="lh-details">
										<img
											className="author-img"
											src={blogPost.author.profilePicture.url}
											alt=""
										/>
										<p className="date">
											{new Date(`${blogPost.datePublished}`).toLocaleDateString(
												'en-us',
												{
													year: 'numeric',
													month: 'short',
													day: 'numeric',
												}
											)}
										</p>
									</div>
									<a
										href={blogPost.postUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="read-more"
									>
										Read post
									</a>
								</div>
							</div>
						))}
					</div>
					<Paginate
						postsPerPage={postsPerPage}
						totalPosts={totalPosts}
						currentPage={currentPage}
						paginate={paginate}
						previousPage={previousPage}
						nextPage={nextPage}
					/>
				</div>
			) : (
				<div className="loading">Loading...</div>
			)}
		</div>
	);
};

export default App;
