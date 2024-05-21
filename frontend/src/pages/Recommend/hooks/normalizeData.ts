export const existInRecommendArray = (data: any, array: any[]) => {
    array.forEach((element) => {
        if (JSON.stringify(element.output) == JSON.stringify(data.output)) 
            return true
    });
    return false;
    }

