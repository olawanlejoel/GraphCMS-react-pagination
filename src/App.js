import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';

import ReactPaginate from 'react-paginate';

const App = () => {
	const [blogPosts, setBlogPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	useEffect(() => {
		const fetchBlogPosts = async () => {
			const { posts } = await request(
				'https://api-us-east-1.graphcms.com/v2/cl3zo5a7h1jq701xv8mfyffi4/master',
				`
			{ 
				posts {
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
			}
		 `
			);

			setBlogPosts(posts);
		};

		fetchBlogPosts();
	}, []);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

	const paginate = ({ selected }) => {
		setCurrentPage(selected + 1);
	};

	return (
		<div className="container">
			<div className="title">
				<h1>Blog</h1>
			</div>
			{blogPosts ? (
				<div className="blog-content-section">
					<div className="blog-container">
						{currentPosts.map((currentPost) => (
							<div className="blog-post" key={currentPost.id}>
								<img className="cover-img" src={currentPost.cover.url} alt="" />
								<h2 className="title">{currentPost.title}</h2>

								<p className="description">{currentPost.excert}</p>
								<div className="card-details">
									<div className="lh-details">
										<img
											className="author-img"
											src={currentPost.author.profilePicture.url}
											alt=""
										/>
										<p className="date">
											{new Date(
												`${currentPost.datePublished}`
											).toLocaleDateString('en-us', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})}
										</p>
									</div>
									<a
										href={currentPost.postUrl}
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
					<ReactPaginate
						onPageChange={paginate}
						pageCount={Math.ceil(blogPosts.length / postsPerPage)}
						previousLabel={'Prev'}
						nextLabel={'Next'}
						containerClassName={'pagination'}
						pageLinkClassName={'page-number'}
						previousLinkClassName={'page-number'}
						nextLinkClassName={'page-number'}
						activeLinkClassName={'active'}
					/>
				</div>
			) : (
				<div className="loading">Loading...</div>
			)}
		</div>
	);
};

export default App;
