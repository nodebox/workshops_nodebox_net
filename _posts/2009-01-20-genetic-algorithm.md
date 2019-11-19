---
layout: post
title: "Genetic algorithm"
workshop_name: 2009 Lahti
workshop_slug: 2009-lahti
categories: [2009-lahti]
author: tom 
assets:
  -
    filename: picture-45.png
    type: image
  -
    filename: picture-32.png
    type: image
---
A genetic algorithm is a search technique based on the principle of evolution. It starts out with a random population of possible solutions (in this example: black&amp;white grids). Each new generation, the fittest members of the population "mate" and create a new population of children. In this case, the <strong>fitness</strong> of a member is based on symmetry: "if I am a black square, is my horizontal and vertical mirror also a black square?".

Here is a random member from the first generation:
<img class="alignnone size-full wp-image-938" title="picture-45" src="http://workshops.nodebox.net/2009/wp-content/uploads/picture-45.png" alt="picture-45" width="298" height="298" />
And here is the fittest member of the 60th generation of ancestors:
<img class="alignnone size-full wp-image-940" title="picture-32" src="http://workshops.nodebox.net/2009/wp-content/uploads/picture-32.png" alt="picture-32" width="298" height="298" />
Although we aren't there yet you can clearly see the pattern arising in the last generation.

Read more:
<a href="http://en.wikipedia.org/wiki/Genetic_algorithm">http://en.wikipedia.org/wiki/Genetic_algorithm</a>

Source code:
<pre># Grid size.
rows = 15
cols = 15

#-----------------------------------------------------------------------------
# A grid represented as a DNA list of True/False values.
# True means black, False means white.
# There are cols*rows elements in the list.

# Obviously, in more complex versions a list could contain all sorts of things,
# as long as our fitness function knows how to compare them.

def dna():
    """ Returns a list of True (1) or False (0) values.
    """
    return [choice((True, False)) for i in range(rows*cols)]

#-----------------------------------------------------------------------------
# Draw grid command.

def draw_grid(dna, width=10):
    for x in range(cols):
        for y in range(rows):
            is_filled = dna[x+y*cols]
            fill(int(not is_filled))
            rect(x*width, y*width, width, width)

#-----------------------------------------------------------------------------
# Grid symmetry functions.

def in_grid(i):
    """ Is the element at position i within the bounds of the list?
    """
    return i &gt; 0 and i &lt; rows*cols

def north(i) : return i-cols # element above
def south(i) : return i+cols # element below
def east(i)  : return i+1    # element to the left
def west(i)  : return i-1    # element to the right

def northeast(i) : return north(east(i))
def northwest(i) : return north(west(i))
def southeast(i) : return south(east(i))
def southwest(i) : return south(west(i))

def row_reflection(i):
    """ Returns the list index of the element in the grid
    that is horizontally symmetrical to this one.
    For example:
    0 1 2 3
    4 5 6 7
    row_reflection(4) returns 7
    row_reflection(5) returns 6
    """
    row = i/cols
    col = i-row*cols
    return row*cols + cols-col-1

def col_reflection(i):
    """
    0 1 2 3
    4 5 6 7
    col_reflection(1) returns 5
    col_reflection(7) returns 3
    """
    row = i/cols
    col = i-row*cols
    return (rows-row-1)*cols + col

#-----------------------------------------------------------------------------
# GA functions.

def recombine(dna1, dna2, crossover=0.5):
    """ Returns a list that combines the head of dna1 and the tail of dna2.
    http://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
    """
    i = int(len(dna1) * crossover)
    return dna1[:i] + dna2[i:]

def fitness(dna):
    """ Symmetry fitness.
    Black elements in the grid that have a horizontal
    and vertical reflection score better.
    You can use the grid symmetry functions to create all sorts of fitness checks.
    """
    score = 0
    for i in range(len(dna)):
        j = row_reflection(i)
        if in_grid(j) and dna[j] == dna[i]:
            score += 1
        j = col_reflection(i)
        if in_grid(j) and dna[j] == dna[i]:
            score += 1
        # Here's another fitness function that will converge to entirely black:
        #if dna[i] == True:
        #    score += 1
    return score

def population(size=500):
    """ Returns a collection of grid DNA lists.
    """
    return [dna() for i in range(size)]

def sort_by_fitness(population):
    """ The DNA lists with the highest fitness will be at the front.
    """
    best = [(fitness(x), x) for x in population]
    best.sort(reverse=True)
    return best

def next_generation(population, top=0.7, determinism=0.8):
    """ Returns a new population of children by recombination.
    http://en.wikipedia.org/wiki/Genetic_algorithm
    """
    # Roughly the fittest top 60% are allowed to reproduce.
    # We say roughly, because good solutions may be cast aside.
    # This keeps the population diverse, so it doesn't converge too fast
    # (less fit DNA might have some portions that become interesting later on).
    population = sort_by_fitness(population)
    parents = list(population)
    i = len(parents)
    iterations = 0
    while len(parents) &gt; len(population)*top:
        if random() &lt; determinism:
            parents.pop(i-1)
        i -= 1
        if i == 0:
            i = len(parents)
        # I don't like while-loops.
        # They tend to run forever when there is a bug.
        # If the loop has been going for 1,000,000 times,
        # something must have gone wrong.
        iterations += 1
        if iterations &gt; 1000000:
            break
    # Cross-combine pairs of parents to a new population of children.
    # We get the best results with a random crossover.
    children = []
    for i in range(len(population)):
        parent1 = choice(parents)
        parent2 = choice(parents)
        if parent1 == parent2:
            parent2 = choice(parents)
        children.append(recombine(parent1[1], parent2[1], crossover=random()))
    return children

from random import seed
seed(0)

# We need some number-crunching power:
import psyco
psyco.full()

# The initial random population:
p = population(size=500)

# Process n generations:
for i in range(80):
    p = next_generation(p, top=0.6, determinism=0.7)

# A list of scores for each member in the final population:
#print [score for score, x in sort_by_fitness(p)]

# The best solution in the final population:
draw_grid(p[0], width=20)</pre>
Improvements
<ul>
	<li>bigger population size: more diversity = more potential</li>
	<li>less determinism: more randomness = slower convergence to <a href="http://en.wikipedia.org/wiki/Local_optimum">local optimum</a></li>
	<li>more generations: human evolution took millions of years too</li>
</ul>
