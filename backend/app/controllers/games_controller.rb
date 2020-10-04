class GamesController < ApplicationController
    def index
        games = Game.all
        render json: games, except: [:created_at, :updated_at]
    end

    def show
        game = Game.find_by(id: params[:id])
        if game
            render json: games, except: [:created_at, :updated_at]
        else
            render json: {message: "Game not found."}
        end
    end
end
