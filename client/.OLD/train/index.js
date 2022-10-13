import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTrainAction,
  removeTrainAction,
  createTrainControlAction,
} from "../../actions/trainActions";
import { useRouter } from "next/router";
function index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const listRef = useRef();

  const allTrains = useSelector((state) => state.train.all.data);

  const [currSelection, setCurrSelection] = useState(null);

  useEffect(() => {
    if (allTrains) return;
    dispatch(getAllTrainAction());
  }, [allTrains]);
  const selectTrain = (e, train, ref) => {
    const element = e.target.classList;
    if (!element.contains("selected")) {
      // if smth already selected remove selected class  from all elements
      if (currSelection) {
        for (let i = 0; i < ref.current.children.length; i++) {
          const element = ref.current.children[i];
          element.classList.remove("selected");
        }
      }
      element.add("selected");
      setCurrSelection(train);
      return;
    }
    if (element.contains("selected")) element.remove("selected");
    setCurrSelection(null);
  };
  const handleRemove = () => {
    if (!currSelection) return;

    dispatch(removeTrainAction(currSelection._id));
  };
  return (
    <div>
      <div>
        <button onClick={() => router.push(`/train/create/`)}>Create</button>
        <button
          onClick={() => router.push(`/train/update/${currSelection._id}`)}
        >
          Edit
        </button>
        <button onClick={() => handleRemove()}>Remove</button>
      </div>
      <ul ref={listRef}>
        {allTrains &&
          allTrains.map((train) => (
            <li onClick={(e) => selectTrain(e, train, listRef)} key={train._id}>
              {train.number}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default index;
