import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import commentService from '../services/comments'

// Componente para mostrar un solo comentario
const CommentList = ({ comment, user, onDelete }) => {
  const isOwner = user && comment.user.id === user.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: "15px",
        padding: "20px",
        marginBottom: "16px"
      }}
    >
      <p style={{
        color: "#fff",
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "12px"
      }}>
        {comment.content}
      </p>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        color: "rgba(255,255,255,0.6)",
        fontSize: "14px"
      }}>
        <span style={{ 
          color: "#00c6ff",
          fontWeight: "500"
        }}>
          {comment.user.name || comment.user.username}
        </span>
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(comment.id)}
            style={{
              background: "rgba(255,59,48,0.1)",
              border: "none",
              padding: "6px 12px",
              borderRadius: "20px",
              color: "#ff3b30",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Eliminar
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

const CommentForm = ({ bookId, onCommentAdded }) => {
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      const newComment = await commentService.create({
        content,
        bookId
      })
      setContent('')
      onCommentAdded(newComment)
    } catch (error) {
      console.error('Error al crear el comentario:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: "30px"
    }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comparte tu opinión sobre este libro..."
        required
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "16px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "15px",
          color: "#fff",
          fontSize: "16px",
          resize: "vertical",
          marginBottom: "16px"
        }}
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: "linear-gradient(45deg, #00c6ff, #ffb347)",
          border: "none",
          padding: "12px 24px",
          borderRadius: "30px",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Publicar comentario
      </motion.button>
    </form>
  )
}

const Comments = ({ bookId, user }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const bookComments = await commentService.getCommentsForBook(bookId)
        setComments(bookComments)
        setError(null)
      } catch (error) {
        console.error('Error al cargar comentarios:', error)
        setError('No se pudieron cargar los comentarios')
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchComments()
    }
  }, [bookId])

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments])
  }

  const handleCommentDelete = async (commentId) => {
    try {
      await commentService.remove(commentId)
      setComments(prevComments => prevComments.filter(c => c.id !== commentId))
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#fff'
      }}>
        Cargando comentarios...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#ff3b30'
      }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {user && (
        <CommentForm bookId={bookId} onCommentAdded={handleCommentAdded} />
      )}
      
      <div style={{ marginTop: '20px' }}>
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentList
              key={comment.id}
              comment={comment}
              user={user}
              onDelete={handleCommentDelete}
            />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '16px'
          }}>
            No hay comentarios aún. ¡Sé el primero en comentar!
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments