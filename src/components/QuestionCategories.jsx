import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Select,
    Button,
    MenuItem,
    TextField,
    Container,
    Typography,
    InputLabel,
    FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import { styles, difficulties, createMarkup } from "../Styling.js";
import QuestionAnswers from './QuestionAnswers.jsx';


const useStyles = makeStyles((theme) => {
    return styles;
});

const QuestionCategories = () => {
    const [questionCategory, setQuestionCategory] = useState([])
    const [category, setCategory] = useState({ id: "", name: "" });

    const [quizNumber, setQuizNumber] = useState(null);
    const [difficulty, setDifficulty] = useState({ id: "", name: "" });
    const [currentQuizStep, setCurrentQuizStep] = useState("start");

    const [quizData, setQuizData] = useState([]);
    let classes = useStyles();
    let fetchCategories = async () => {
        let { data } = await axios.get(`https://opentdb.com/api.php?amount=${quizNumber}&category=${category.id}&difficulty=${difficulty.name.toLowerCase()}`);


        let formattedData = data.results.map((category) => {
            let incorrectAnswersIndex = category.incorrect_answers.length;
            const randomIndex = Math.random() * (incorrectAnswersIndex - 0) + 0;
            category.incorrect_answers.splice(randomIndex, 0, category.correct_answer);
            return {
                ...category,
                answers: category.incorrect_answers,
            };
        });
        setCurrentQuizStep("results")
        setQuizData(formattedData);
    };

    const fetchQuestionCategories = async () => {
        let { data } = await axios.get("https://opentdb.com/api_category.php");
        setQuestionCategory(data.trivia_categories);
    }
    useState(() => { fetchQuestionCategories(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!quizData.length && quizNumber && category.id && difficulty.name) {
            fetchCategories();
        }
    };

    const handleSelectChange = (e) => {
        e.preventDefault();
        const selectedCategory = questionCategory.find(
            (cat) => cat.id === e.target.value
        );
        setCategory(selectedCategory);
    };

    const handleDifficultyChange = (e) => {
        e.preventDefault();
        const selectedDifficulty = difficulties.find(
            (diff) => diff.id === e.target.value
        );
        setDifficulty(selectedDifficulty);
    };
    const handleChange = (e) => {
        e.preventDefault();
        setQuizNumber(e.target.value);
    };
    const resetQuiz = (e) => {
        e.preventDefault();
        setQuizData([]);
        setCategory("");
        setQuizNumber("");
        setDifficulty("");
        setCurrentQuizStep("start");
        window.scrollTo(0, "20px");
      };

    return (
        <Container>
            <Paper className={classes.paper}>
                {currentQuizStep === "start" ?
                <>
                <Typography variant="h1" className={classes.mainTitle}>
                    Get Questions:
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="category-select-label">
                                    Select category:
                                </InputLabel>
                                <Select
                                    required
                                    name="category"
                                    value={category.id || ""}
                                    id="category-select"
                                    label="Select category"
                                    labelId="category-select-label"
                                    onChange={handleSelectChange}
                                >
                                    {questionCategory.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            <span
                                                dangerouslySetInnerHTML={createMarkup(
                                                    category.name
                                                )}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="difficulty-select-label">
                                    Select Difficulty:
                                </InputLabel>
                                <Select
                                    required
                                    name="difficulty"
                                    value={difficulty.id || ""}
                                    id="difficulty-select"
                                    label="Select Difficulty"
                                    labelId="difficulty-select-label"
                                    onChange={handleDifficultyChange}
                                >
                                    {difficulties.map((difficulty) => (
                                        <MenuItem key={difficulty.id} value={difficulty.id}>
                                            {difficulty.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputProps={{ min: 1, max: 10 }}
                                required
                                fullWidth
                                type="number"
                                id="quiz-number"
                                variant="outlined"
                                name="quiz-number"
                                label={`Add a quiz number from 1 to 10`}
                                value={quizNumber || ""}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        className={classes.submitButton}
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </form> </> : <QuestionAnswers 
                quizData={quizData} 
                classes={classes} 
                resetQuiz={resetQuiz}
                currentQuizStep={currentQuizStep}
                setCurrentQuizStep={setCurrentQuizStep}/>}
            </Paper>
        </Container>
    );
}

export default QuestionCategories
