import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import DefaultImg from '../../../assets/images/default.png'

interface Item {
  id:number,
  name: string,
  price: string,
  image_url: string
}
export default function Items() {

  const [items, setitems] = useState([]);
  // search
  const [searchResults, setsearchResults] = useState([]);
  const [query, setquery] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const [isOpen, setIsOpen] = useState(false);
  // navigate
  const navigate = useNavigate();
  // Get items from api
  useEffect(()=>{
    if(!localStorage.getItem('token')) {
      navigate('/');
    } 
      axios.get('https://test1.focal-x.com/api/items',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      })
      .then(res => setitems(res.data))
      .catch(err => console.log(err))
  },[]);
  // Number of items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
        let screenWidth = window.innerWidth;
        let newItemsPerPage = 8;

        if (screenWidth >= 1670) {
          newItemsPerPage = 10; 
        }
        if (screenWidth === 1440) {
          newItemsPerPage = 8; 
        }
        if (screenWidth < 1440) {
            newItemsPerPage = 6;
        }
        if (screenWidth < 1192) {
            newItemsPerPage = 4;
        }
        if (screenWidth < 944) {
          newItemsPerPage = 2; 
      }
      return newItemsPerPage;
    };
    setItemsPerPage(updateItemsPerPage());
    window.addEventListener('resize', () => {
        setItemsPerPage(updateItemsPerPage());
    });
    return () => {
        window.removeEventListener('resize', () => {
            setItemsPerPage(updateItemsPerPage());
        });
    };
}, []);
    // Update search results 
    useEffect(() => {
      if (query) {
        const results = items.filter((item: Item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        setsearchResults(results);
        setCurrentPage(1);
      } else {
        setsearchResults(items);
      }
    }, [query, items]);

  const paginate =(pageNumber: number): void  => setCurrentPage(pageNumber);
   // next page 
  const nextPage = (): void => {
    if (currentPage < Math.ceil(searchResults.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  // prev page 
  const prevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const showItem = (id: number) => {
      navigate(`/dashboard/item/show/${id}`);
  }
  const editItem = (id: number) => {
    navigate(`/dashboard/item/edit/${id}`);
  }
 
  //delete 
  const showPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
      setIsOpen(false);
  };

   function handleYes(id: number) {
    axios.delete(`https://test1.focal-x.com/api/items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      .then(res => {
        setitems((prev) => (prev.filter((item: Item) => (item.id !== id)))); 
        navigate('/dashboard/items');
        closePopup();
      })
      .catch(err => console.log(err)) ;
  };

  const handleNo = () => {
    navigate('/dashboard/items');
    closePopup();
   
  };
  const delItem = () => {
    showPopup();
  }

const paginationButtons = () => {
  const totalPages = Math.ceil(searchResults.length / itemsPerPage); 
  const buttons = [];
  
  for (let i = 1; i <= 3 && i <= totalPages; i++) {
      buttons.push(
          <button key={i} onClick={() => paginate(i)} className={i === currentPage ? "active" : ""}>
              {i}
          </button>
      );
  }
  if (currentPage > 4) { buttons.push(<span key="ellipsis-before">...</span>);}
  if (currentPage > 3 && currentPage < totalPages - 2) {
      buttons.push(
          <button key={currentPage - 1} onClick={() => paginate(currentPage - 1)}>
              {currentPage - 1}
          </button> );
      buttons.push(
          <button key={currentPage} onClick={() => paginate(currentPage)} className="active">
              {currentPage}
          </button> );
      buttons.push(
          <button key={currentPage + 1} onClick={() => paginate(currentPage + 1)}>
              {currentPage + 1}
          </button> );
  }
  if (currentPage < totalPages - 3) {
      buttons.push(<span key="ellipsis-after">...</span>);
    }
  for (let i = totalPages - 1; i <= totalPages; i++) {
      if (i > 3) {
          buttons.push(
              <button key={i} onClick={() => paginate(i)} className={i === currentPage ? "active" : ""}>
                  {i}
              </button>
          );}}
  return buttons;
};

  return (
    <>
    <div className='header'>
      <input placeholder='Search product by name'
            value={query}
            onChange={(e) => setquery(e.target.value)}/>
      <FontAwesomeIcon icon={faSearch} className='icon-search'/>
    </div>
    <div style={{textAlign:"right",marginTop:"48px", marginBottom:"32px"}}>
    <Link to={'/dashboard/add'} 
    style={{borderRadius:"4px", fontSize:"14px", fontWeight:"500", color:"white",
        backgroundColor: "#FEAF00",
        padding:"13px 24px"
    }}> ADD NEW PRODUCT </Link>
    </div>
    <div className='items'>
    {currentItems.map((item: Item,index) => {
        return ( <>
            <div key={index} className="box">
              <img src={item.image_url ? item.image_url : DefaultImg} alt="item" width="100%" height="100%"
                    onClick={() => showItem(item.id)}
                    style={{cursor:"pointer", objectFit:"contain"}} />
              <div className="info" style={{pointerEvents: 'none'}}>
                <p style={{ pointerEvents: 'auto' }}>{item.name}</p>
                <div className="action" style={{ pointerEvents: 'auto' }}>
                  <button className='edit'  onClick={() => editItem(item.id)}>Edit</button>
                  <button  className='delete' onClick={() => delItem()}>Delete</button>
                  {isOpen && (
                    <>
                    <div className="overlay"></div>
                    <div className="pop-up">
                        <p>Are you sure you want to delete the product?</p>
                        <div className="buttons">
                          <button onClick={()=>handleYes(item.id)}>Yes</button>
                          <button onClick={handleNo}>No</button>
                        </div>  
                    </div> </> )}
                </div>
              </div> 
            </div> </>
          )})}        
    </div>
    <div className="pagination">
        {searchResults.length > itemsPerPage && (
          <>
          <button onClick={prevPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {paginationButtons()}
          <button onClick={nextPage} disabled={currentPage === Math.ceil(searchResults.length / itemsPerPage)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          </>
        )}
    </div>     
    </>
  )
}
