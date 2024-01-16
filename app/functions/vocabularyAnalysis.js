// Function to calculate overall vocabulary performance for a class
export const calculateClassVocabularyPerformance = (classStudents) => {
    const totalExcellentCount = classStudents.reduce((sum, student) => {
        return sum + student.vocabulary.filter((entry) => entry.status === 'excellent').length;
    }, 0);

    const totalVocabularyEntries = classStudents.length * classStudents[0].vocabulary.length; // Assuming all students have the same number of vocabulary entries

    const vocabularyPerformance = (totalExcellentCount / totalVocabularyEntries) * 100;
    return vocabularyPerformance.toFixed(2); // Limit to two decimal places
};

// Function to calculate overall homework completion rate for a class
export const calculateClassHomeworkCompletionRate = (classStudents) => {
    const totalCompletedHomework = classStudents.reduce((sum, student) => {
        return sum + student.homework.filter((entry) => entry.status === true).length;
    }, 0);

    const totalHomeworkEntries = classStudents.length * classStudents[0].homework.length; // Assuming all students have the same number of homework entries

    const homeworkCompletionRate = (totalCompletedHomework / totalHomeworkEntries) * 100;
    return homeworkCompletionRate.toFixed(2); // Limit to two decimal places
};

export const calculateAverageVocabularyStatus = (vocabulary) => {
    const totalVocabularyEntries = vocabulary.length;
    const totalExcellentCount = vocabulary.filter((entry) => entry.status === 'excellent').length;

    const averageVocabularyStatus = (totalExcellentCount / totalVocabularyEntries) * 100;
    return averageVocabularyStatus.toFixed(2); // Limit to two decimal places
};

export const calculateHomeworkCompletionRate = (homework) => {
    const totalHomeworkEntries = homework.length;
    const totalCompletedHomework = homework.filter((entry) => entry.status === true).length;

    const homeworkCompletionRate = (totalCompletedHomework / totalHomeworkEntries) * 100;
    return homeworkCompletionRate.toFixed(2); // Limit to two decimal places
};


