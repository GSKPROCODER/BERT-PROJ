from pydantic import BaseModel, Field, field_validator


class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Text cannot be empty or whitespace only")
        return v.strip()


class RiskAnalysis(BaseModel):
    has_risk: bool = Field(..., description="Whether any risk flags were detected")
    risk_level: str = Field(..., description="Risk level: low, medium, or high")
    risk_score: float = Field(..., description="Risk score from 0.0 to 1.0")
    flags: list[str] = Field(..., description="List of detected risk flags")
    recommendations: list[str] = Field(..., description="Recommended actions")


class SentimentResponse(BaseModel):
    sentiment: str
    scores: dict[str, float] = Field(
        ..., description="Sentiment scores with keys: positive, neutral, negative"
    )
    confidence: float = Field(..., description="Confidence score for the chosen sentiment")
    probabilities: dict[str, float] = Field(
        ..., description="Probability distribution over sentiment labels"
    )
    risk_analysis: RiskAnalysis | None = Field(
        None, description="Risk analysis results (optional)"
    )


class EmotionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Text cannot be empty or whitespace only")
        return v.strip()


class EmotionResponse(BaseModel):
    emotion: str
    probabilities: dict[str, float] = Field(
        ...,
        description="Emotion probabilities with keys: anger, disgust, fear, joy, neutral, sadness, surprise",
    )


class BulkAnalysisRequest(BaseModel):
    texts: list[str] = Field(..., min_items=1, max_items=100)

    @field_validator("texts")
    @classmethod
    def validate_texts(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Texts list cannot be empty")
        return [text.strip() for text in v if text.strip()]


class BulkAnalysisItem(BaseModel):
    text: str
    sentiment: str
    scores: dict[str, float]
    emotion: str
    probabilities: dict[str, float]


class BulkAnalysisResponse(BaseModel):
    results: list[BulkAnalysisItem]
    total: int
    successful: int
    failed: int


class AspectSentiment(BaseModel):
    aspect: str
    type: str
    label: str
    position: dict[str, int]
    sentiment: str
    confidence: float
    probabilities: dict[str, float]
    context: str


class OverallSentiment(BaseModel):
    sentiment: str
    confidence: float
    probabilities: dict[str, float]


class AspectAnalysisResponse(BaseModel):
    text: str
    aspects: list[AspectSentiment]
    overall_sentiment: OverallSentiment
    total_aspects: int
