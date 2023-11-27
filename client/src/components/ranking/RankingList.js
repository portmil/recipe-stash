
import PropTypes from 'prop-types';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import RecipeCard from '../recipeInfo/RecipeCard';

const RankingList = ({ name, recipes, isDragDisabled }) => {

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#EF960A' : '',
    transition: 'background 0.4s ease',
    padding: '10px',
  });

  const getItemStyle = (draggableStyle) => ({
    paddingBottom: '15px',
    ...draggableStyle
  });
  
  return (
    <Droppable droppableId={name}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}>
          {recipes.map((recipe, index) => (
            <Draggable
              key={recipe.id}
              draggableId={recipe.id}
              index={index}
              isDragDisabled={isDragDisabled}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    provided.draggableProps.style
                  )}>
                  <RecipeCard recipe={recipe} key={index}/>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

RankingList.propTypes = {
  name: PropTypes.string,
  recipes: PropTypes.array,
  isDragDisabled: PropTypes.bool
};

export default RankingList;